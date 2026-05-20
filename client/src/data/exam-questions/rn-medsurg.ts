import { getAssetUrl } from "@/lib/asset-url";
import type { ExamQuestion } from "./types";

const imgDVTExam = getAssetUrl("dvt_1773517432559.png");
const imgFirstDegreeBlockExam = getAssetUrl("firstdegreeblock_1773517432559.png");
const imgAVFistulaExam = getAssetUrl("avfistula_1773517432559.png");
const imgACSExam = getAssetUrl("ACS_1773517432559.jpeg");
const imgDecelsExam = getAssetUrl("decels_1773517432559.png");

export const rnMedsurgQuestions: ExamQuestion[] = [
  // ===== CARDIOVASCULAR (Questions 1-20) =====
  {
    q: "A client with acute ST-elevation myocardial infarction (STEMI) is admitted to the emergency department. Vital signs: BP 88/54, HR 112, RR 24. The nurse notes bilateral crackles and jugular venous distension. Which intervention should the nurse anticipate first?",
    o: ["Prepare for emergent percutaneous coronary intervention", "Administer IV nitroglycerin infusion", "Position the client flat and elevate the legs", "Administer a 500 mL normal saline bolus"],
    a: 0,
    r: "STEMI with cardiogenic shock signs (hypotension, tachycardia, pulmonary congestion, JVD) requires emergent reperfusion. PCI is the gold standard for STEMI within 90 minutes of first medical contact. Nitroglycerin is contraindicated in hypotension. Flat positioning worsens pulmonary congestion. Fluid bolus can worsen cardiogenic shock.",
    s: "Cardiovascular"
  },
  {
    q: "A nurse is caring for a client 6 hours post-cardiac catheterization via the right femoral artery. The client reports numbness and tingling in the right foot. Assessment reveals a cool, pale right foot with a diminished pedal pulse. What is the priority nursing action?",
    o: ["Notify the healthcare provider immediately", "Elevate the right leg above heart level", "Apply a warm blanket to the right foot", "Document findings and reassess in 30 minutes"],
    a: 0,
    r: "Cool, pale extremity with diminished pulse and paresthesia after femoral catheterization indicates arterial occlusion or thrombus formation, which is a vascular emergency. The provider must be notified immediately as surgical intervention may be required. Elevation does not restore arterial flow. Warming masks assessment findings. Delaying notification risks limb ischemia.",
    s: "Cardiovascular"
  },
  {
    q: "A client with new-onset atrial fibrillation has a ventricular rate of 148 bpm. The client is alert, oriented, and reports palpitations but denies chest pain. BP is 132/78. Which treatment does the nurse anticipate?",
    o: ["IV diltiazem for rate control", "Synchronized cardioversion", "IV amiodarone bolus", "Defibrillation at 200 joules"],
    a: 0,
    r: "In stable atrial fibrillation with rapid ventricular response, rate control with calcium channel blockers (diltiazem) or beta-blockers is the first-line approach. The client is hemodynamically stable, so cardioversion is not urgently needed. Amiodarone is used for rhythm control but is not first-line for rate control in this scenario. Defibrillation is only for pulseless rhythms.",
    s: "Cardiovascular"
  },
  {
    q: "A nurse is preparing to administer IV heparin to a client with deep vein thrombosis. The baseline aPTT is 28 seconds. After 6 hours of infusion, the aPTT result is 95 seconds (therapeutic range 60-80 seconds). What should the nurse do?",
    o: ["Stop the infusion, notify the provider, and recheck aPTT per protocol", "Continue the infusion at the current rate", "Decrease the infusion rate by 50%", "Administer protamine sulfate immediately"],
    a: 0,
    r: "An aPTT of 95 seconds exceeds the therapeutic range and indicates over-anticoagulation, increasing bleeding risk. Per most heparin protocols, the infusion should be stopped, the provider notified, and aPTT rechecked after a specified interval. Continuing risks hemorrhage. Decreasing without stopping may not adequately correct levels. Protamine is the antidote but reserved for active bleeding.",
    s: "Cardiovascular",
    image: imgDVTExam
  },
  {
    q: "A client with heart failure is prescribed spironolactone 25 mg daily in addition to lisinopril and furosemide. Which laboratory finding should prompt the nurse to hold the spironolactone and notify the provider?",
    o: ["Potassium 5.8 mEq/L", "Sodium 136 mEq/L", "BUN 22 mg/dL", "Magnesium 1.8 mEq/L"],
    a: 0,
    r: "Spironolactone is a potassium-sparing diuretic. Combined with an ACE inhibitor (lisinopril), the risk of hyperkalemia is significant. A potassium of 5.8 mEq/L is dangerously elevated (normal 3.5-5.0) and can cause lethal cardiac dysrhythmias. The medication should be held and the provider notified. The other values are within or near normal ranges.",
    s: "Cardiovascular"
  },
  {
    q: "A client with an abdominal aortic aneurysm (AAA) suddenly reports severe tearing back pain. Assessment reveals a pulsatile abdominal mass, BP 78/42, HR 130, and diaphoresis. What is the nurse's priority action?",
    o: ["Establish two large-bore IV lines and prepare for emergent surgery", "Administer IV morphine for pain management", "Obtain a CT scan to confirm rupture", "Place the client in Trendelenburg position"],
    a: 0,
    r: "These findings indicate a ruptured AAA, which is a life-threatening surgical emergency. The priority is establishing IV access for volume resuscitation and preparing for immediate surgical repair. Pain management is secondary to hemodynamic stabilization. CT scan delays treatment. Trendelenburg alone does not address the hemorrhage.",
    s: "Cardiovascular"
  },
  {
    q: "A nurse is providing discharge teaching to a client prescribed warfarin for atrial fibrillation. Which client statement indicates a need for further education?",
    o: ["I should eat a large spinach salad every day to stay healthy", "I will use an electric razor instead of a straight razor", "I need to have blood tests regularly to check my INR", "I will notify my dentist that I am taking this medication"],
    a: 0,
    r: "Spinach is high in vitamin K, which antagonizes warfarin. Clients should maintain a consistent intake of vitamin K-rich foods rather than dramatically increasing consumption. Large daily amounts would reduce warfarin effectiveness. Using an electric razor, monitoring INR, and notifying healthcare providers about anticoagulant use are all correct behaviors.",
    s: "Cardiovascular"
  },
  {
    q: "A client 2 days post-coronary artery bypass graft surgery develops a pericardial friction rub and reports sharp chest pain that worsens with inspiration and lying flat. Temperature is 38.2 C. Which condition should the nurse suspect?",
    o: ["Postpericardiotomy syndrome", "Pulmonary embolism", "Sternal wound infection", "Cardiac tamponade"],
    a: 0,
    r: "Postpericardiotomy syndrome is an inflammatory response occurring days to weeks after cardiac surgery, presenting with pericardial friction rub, pleuritic chest pain worsened by lying flat, and low-grade fever. PE presents with sudden dyspnea and tachycardia without friction rub. Wound infection presents with local signs. Tamponade presents with muffled heart sounds and hypotension.",
    s: "Cardiovascular"
  },
  {
    q: "A nurse is monitoring a client on a continuous cardiac monitor. The rhythm shows a regular pattern with a PR interval of 0.36 seconds and a consistent 1:1 P-wave to QRS relationship. What rhythm does this represent?",
    o: ["First-degree AV block", "Second-degree AV block Type I (Wenckebach)", "Normal sinus rhythm", "Third-degree AV block"],
    a: 0,
    r: "First-degree AV block is characterized by a PR interval greater than 0.20 seconds with a consistent 1:1 P-wave to QRS relationship and regular rhythm. A PR of 0.36 seconds is prolonged. Wenckebach shows progressively lengthening PR intervals. Normal sinus rhythm has a PR of 0.12-0.20 seconds. Third-degree shows no relationship between P waves and QRS complexes.",
    s: "Cardiovascular",
    image: imgFirstDegreeBlockExam
  },
  {
    q: "A client with peripheral arterial disease reports intermittent claudication. Which assessment finding would the nurse expect?",
    o: ["Ankle-brachial index of 0.6", "Warm, edematous lower extremities", "Prominent varicose veins", "Brown skin discoloration around the ankles"],
    a: 0,
    r: "An ABI less than 0.9 indicates peripheral arterial disease. An ABI of 0.6 indicates moderate PAD, consistent with intermittent claudication. Warm edematous extremities, varicose veins, and brown discoloration are signs of venous insufficiency, not arterial disease. Arterial disease presents with cool, pale extremities with diminished pulses.",
    s: "Cardiovascular"
  },
  {
    q: "A client with aortic stenosis is scheduled for aortic valve replacement. During preoperative assessment, the nurse identifies which finding as most characteristic of this condition?",
    o: ["Systolic crescendo-decrescendo murmur heard best at the right upper sternal border", "Diastolic blowing murmur heard at the left lower sternal border", "Holosystolic murmur radiating to the left axilla", "Continuous machinery-like murmur"],
    a: 0,
    r: "Aortic stenosis produces a characteristic systolic crescendo-decrescendo (diamond-shaped) murmur best heard at the right second intercostal space (right upper sternal border), often radiating to the carotid arteries. Diastolic blowing murmur suggests aortic regurgitation. Holosystolic murmur radiating to the axilla suggests mitral regurgitation. Continuous machinery murmur suggests patent ductus arteriosus.",
    s: "Cardiovascular"
  },
  {
    q: "A nurse is caring for a client with infective endocarditis. Which assessment finding would the nurse expect to find?",
    o: ["Petechiae on the conjunctivae and painful nodules on the fingertips", "Pitting edema in bilateral lower extremities", "Jugular venous distension with hepatomegaly", "S3 heart sound with bibasilar crackles"],
    a: 0,
    r: "Infective endocarditis presents with petechiae (skin, conjunctivae, oral mucosa), Osler nodes (painful fingertip nodules from immune complex deposition), Janeway lesions (painless palmar/sole macules), and splinter hemorrhages. The other findings are more characteristic of heart failure, though endocarditis can eventually cause heart failure if the valve is severely damaged.",
    s: "Cardiovascular"
  },
  {
    q: "A client is receiving tissue plasminogen activator (tPA) for acute ischemic stroke. The nurse should monitor most closely for which complication?",
    o: ["Intracranial hemorrhage", "Acute renal failure", "Anaphylactic reaction", "Pulmonary embolism"],
    a: 0,
    r: "The most dangerous complication of thrombolytic therapy is hemorrhage, particularly intracranial hemorrhage, which can be fatal. The nurse must perform frequent neurological assessments and monitor for signs of increased intracranial pressure, sudden headache, or neurological deterioration. The other complications are possible but intracranial hemorrhage is the most critical concern.",
    s: "Cardiovascular"
  },
  {
    q: "A nurse assesses a client with hypertensive crisis (BP 240/140). The client reports severe headache, blurred vision, and nausea. Which organ damage finding requires the most urgent intervention?",
    o: ["Papilledema on fundoscopic examination", "Serum creatinine of 1.4 mg/dL", "Proteinuria on urinalysis", "Mild bilateral pedal edema"],
    a: 0,
    r: "Papilledema indicates increased intracranial pressure from hypertensive encephalopathy, which is a life-threatening emergency requiring immediate IV antihypertensive therapy. Combined with the headache and visual changes, this indicates end-organ damage to the brain. Mildly elevated creatinine, proteinuria, and mild edema suggest kidney effects but are less immediately dangerous.",
    s: "Cardiovascular"
  },
  {
    q: "A client with chronic stable angina is prescribed sublingual nitroglycerin PRN. Which instruction should the nurse include in client education?",
    o: ["Take one tablet and if pain persists after 5 minutes, call 911", "Take up to 3 tablets at 5-minute intervals before seeking medical help", "Swallow the tablet with a glass of water when chest pain occurs", "Store the tablets in a clear container on the windowsill for easy access"],
    a: 0,
    r: "Current AHA guidelines recommend taking one NTG tablet and if chest pain is not relieved in 5 minutes, calling 911 rather than waiting to take additional doses. This change from the older 3-dose protocol reduces delay in seeking emergency care. NTG should be placed under the tongue, not swallowed. It should be stored in a dark, airtight container away from heat and light.",
    s: "Cardiovascular"
  },
  {
    q: "A client on a telemetry unit develops a heart rate of 38 bpm. The client is alert but reports dizziness. BP is 86/52. The nurse identifies sinus bradycardia on the monitor. Which medication should the nurse prepare to administer?",
    o: ["Atropine 0.5 mg IV", "Epinephrine 1 mg IV push", "Adenosine 6 mg rapid IV push", "Amiodarone 150 mg IV"],
    a: 0,
    r: "Symptomatic sinus bradycardia with hypotension is treated with atropine 0.5 mg IV per ACLS protocol. Atropine increases heart rate by blocking vagal tone. Epinephrine 1 mg IV push is for cardiac arrest. Adenosine slows conduction and would worsen bradycardia. Amiodarone is an antiarrhythmic that can also worsen bradycardia.",
    s: "Cardiovascular"
  },
  {
    q: "A nurse is admitting a client with suspected acute coronary syndrome. The initial troponin I level is within normal limits. The client continues to report intermittent chest pain. What should the nurse anticipate?",
    o: ["Repeat troponin levels in 3-6 hours per protocol", "Discharge the client with follow-up in 24 hours", "Administer thrombolytic therapy immediately", "Schedule an outpatient stress test for the following week"],
    a: 0,
    r: "Troponin levels may take 3-6 hours to rise after myocardial injury. A single normal troponin does not rule out ACS, so serial troponin measurements are essential. Premature discharge is dangerous. Thrombolytics require confirmed STEMI on ECG. Delaying stress testing when ACS is actively suspected is inappropriate.",
    s: "Cardiovascular"
  },
  {
    q: "A client with chronic heart failure is taking carvedilol 25 mg twice daily. During a routine visit, the nurse assesses HR 54 bpm and BP 98/60. The client reports fatigue but denies syncope. What is the most appropriate nursing action?",
    o: ["Hold the medication and contact the prescriber", "Administer the medication as prescribed", "Instruct the client to take only the morning dose", "Administer IV atropine 0.5 mg"],
    a: 0,
    r: "Carvedilol is a beta-blocker that can cause bradycardia and hypotension. With HR 54 and BP 98/60 with symptoms of fatigue, the medication should be held and the prescriber contacted for dose adjustment. Administering may worsen hemodynamics. The nurse cannot independently change dosing schedules. Atropine is for emergency symptomatic bradycardia.",
    s: "Cardiovascular"
  },
  {
    q: "A client presents with sudden onset of a cold, pulseless left lower extremity. The skin is mottled and the client rates the pain as 10/10. Which condition does the nurse suspect?",
    o: ["Acute arterial embolism", "Deep vein thrombosis", "Chronic peripheral arterial disease", "Compartment syndrome"],
    a: 0,
    r: "The 6 Ps of acute arterial occlusion are: Pain (severe), Pallor, Pulselessness, Paresthesia, Paralysis, and Poikilothermia (cold). This is a vascular emergency requiring immediate intervention. DVT presents with warmth, edema, and erythema. Chronic PAD develops gradually. Compartment syndrome presents with pain on passive stretch and tense swelling.",
    s: "Cardiovascular"
  },
  {
    q: "A client is admitted with a blood pressure of 198/112 and no symptoms of acute target organ damage. The nurse should anticipate which approach to blood pressure management?",
    o: ["Gradual reduction over 24-48 hours with oral antihypertensives", "Rapid reduction to normal with IV nitroprusside", "Immediate reduction to below 120/80 within 1 hour", "No treatment needed if the client is asymptomatic"],
    a: 0,
    r: "Hypertensive urgency (severely elevated BP without acute target organ damage) is managed with gradual reduction over 24-48 hours using oral medications. Rapid reduction can cause cerebral hypoperfusion, stroke, or MI. IV nitroprusside is for hypertensive emergency with organ damage. An asymptomatic but severely elevated BP still requires treatment.",
    s: "Cardiovascular"
  },
  // ===== RESPIRATORY (Questions 21-40) =====
  {
    q: "A client with chronic obstructive pulmonary disease (COPD) is on 2 L/min oxygen via nasal cannula. ABG results show: pH 7.32, PaCO2 58 mmHg, PaO2 62 mmHg, HCO3 34 mEq/L. How should the nurse interpret these results?",
    o: ["Partially compensated respiratory acidosis with chronic CO2 retention", "Uncompensated metabolic acidosis", "Fully compensated respiratory alkalosis", "Mixed respiratory and metabolic acidosis"],
    a: 0,
    r: "The pH is acidotic (below 7.35), PaCO2 is elevated (normal 35-45), and HCO3 is elevated (normal 22-26), indicating renal compensation for chronic CO2 retention. The pH has not returned to normal range, so it is partially compensated. This is typical of COPD with chronic hypercapnia where the kidneys retain bicarbonate to buffer the acidosis.",
    s: "Respiratory"
  },
  {
    q: "A nurse is caring for a client with a chest tube connected to a water-seal drainage system. Which finding requires immediate intervention?",
    o: ["Continuous bubbling in the water-seal chamber", "Tidaling in the water-seal chamber during respiration", "Drainage of 50 mL of serosanguineous fluid in the past hour", "The collection chamber shows 200 mL total since insertion 8 hours ago"],
    a: 0,
    r: "Continuous bubbling in the water-seal chamber indicates an air leak in the system, either from the client (bronchopleural fistula) or a connection leak, requiring immediate assessment. Tidaling is normal and indicates the system is functioning. 50 mL/hour and 200 mL over 8 hours are within acceptable drainage amounts.",
    s: "Respiratory"
  },
  {
    q: "A client with pneumonia has the following assessment findings: temperature 39.4 C, HR 118, RR 28, BP 82/48, WBC 18,200, lactate 4.2 mmol/L. Which condition should the nurse recognize?",
    o: ["Sepsis with probable progression to septic shock", "Community-acquired pneumonia without complications", "Acute respiratory distress syndrome", "Pulmonary embolism"],
    a: 0,
    r: "This client meets SIRS criteria (fever, tachycardia, tachypnea, elevated WBC) with a suspected infection source (pneumonia) plus hypotension and elevated lactate (greater than 2 mmol/L), indicating sepsis progressing toward septic shock. The lactate of 4.2 indicates tissue hypoperfusion. ARDS would show bilateral infiltrates and severe hypoxemia. PE presentation differs.",
    s: "Respiratory"
  },
  {
    q: "A client with asthma is using a metered-dose inhaler (MDI) with a spacer. The nurse observes the client exhale, place the MDI in the spacer, and take a quick forceful breath. Which technique should the nurse correct?",
    o: ["The client should inhale slowly and deeply, not quickly and forcefully", "The client should not use a spacer with a metered-dose inhaler", "The client should inhale before activating the MDI", "The client should hold the MDI 2 inches from the mouth instead of using a spacer"],
    a: 0,
    r: "When using an MDI with a spacer, the client should inhale slowly and deeply over 3-5 seconds to allow medication particles to reach the lower airways. A quick forceful breath causes the medication to impact in the oropharynx rather than reaching the bronchioles. Using a spacer is correct technique. The client should activate the MDI then inhale. A spacer is preferred over open-mouth technique.",
    s: "Respiratory"
  },
  {
    q: "A client on mechanical ventilation develops sudden-onset high peak inspiratory pressures, absent breath sounds on the right, tracheal deviation to the left, and hypotension. What does the nurse suspect?",
    o: ["Right-sided tension pneumothorax", "Right mainstem bronchus intubation", "Ventilator-associated pneumonia", "Mucus plug in the endotracheal tube"],
    a: 0,
    r: "Sudden high peak pressures, absent breath sounds on one side, tracheal deviation away from the affected side, and hypotension are classic signs of tension pneumothorax. This is a life-threatening emergency requiring immediate needle decompression. Right mainstem intubation would show absent left breath sounds. VAP develops gradually. Mucus plugging would not cause tracheal deviation.",
    s: "Respiratory"
  },
  {
    q: "A client with a pulmonary embolism is started on a heparin drip and warfarin simultaneously. The client asks why both medications are needed. What is the nurse's best response?",
    o: ["Heparin works immediately while warfarin takes 3-5 days to reach therapeutic levels", "Both medications work on the same pathway and are more effective together", "Warfarin prevents new clots while heparin dissolves the existing clot", "Heparin is given to prevent an allergic reaction to warfarin"],
    a: 0,
    r: "Heparin provides immediate anticoagulation, while warfarin inhibits vitamin K-dependent clotting factor synthesis, which takes 3-5 days to achieve therapeutic effect (INR 2-3). The overlap ensures continuous anticoagulation during the transition period. They work on different pathways. Neither dissolves existing clots. There is no relationship to allergic reactions.",
    s: "Respiratory"
  },
  {
    q: "A nurse is suctioning a client through an endotracheal tube. During the procedure, the cardiac monitor shows a heart rate drop from 88 to 48 bpm. What should the nurse do first?",
    o: ["Stop suctioning immediately and hyperoxygenate the client", "Continue suctioning to clear the airway quickly", "Administer atropine 0.5 mg IV", "Increase the suction pressure and duration"],
    a: 0,
    r: "Vagal stimulation from suctioning can cause bradycardia. The nurse should immediately stop suctioning and hyperoxygenate the client with 100% oxygen. The heart rate should recover once the vagal stimulus is removed. Continuing or increasing suction worsens the vagal response. Atropine is not needed unless the bradycardia persists after stopping stimulation.",
    s: "Respiratory"
  },
  {
    q: "A client with COPD has an SpO2 of 87% on room air. The nurse applies oxygen at 6 L/min via simple face mask. Thirty minutes later, the client becomes drowsy and difficult to arouse. ABG shows pH 7.24, PaCO2 82 mmHg. What occurred?",
    o: ["Suppression of the hypoxic respiratory drive leading to CO2 narcosis", "Oxygen toxicity from prolonged high-flow oxygen", "Pulmonary embolism causing acute respiratory failure", "Anaphylactic reaction to the oxygen delivery device"],
    a: 0,
    r: "In COPD clients with chronic CO2 retention, the respiratory drive shifts from CO2-mediated to hypoxia-mediated. Administering high-flow oxygen eliminates the hypoxic drive, causing hypoventilation, CO2 retention, and CO2 narcosis (somnolence, respiratory acidosis). The target SpO2 for COPD is 88-92%. Oxygen toxicity requires prolonged exposure at high FiO2. The other options do not fit this clinical picture.",
    s: "Respiratory"
  },
  {
    q: "A client with tuberculosis has been on isoniazid, rifampin, pyrazinamide, and ethambutol for 2 weeks. The client reports numbness and tingling in both feet. Which medication is most likely responsible, and what adjunct therapy should the nurse anticipate?",
    o: ["Isoniazid; pyridoxine (vitamin B6) supplementation", "Rifampin; thiamine supplementation", "Ethambutol; folic acid supplementation", "Pyrazinamide; calcium supplementation"],
    a: 0,
    r: "Isoniazid causes peripheral neuropathy (numbness, tingling in extremities) by depleting pyridoxine (vitamin B6). Pyridoxine supplementation (25-50 mg daily) prevents and treats this side effect. Rifampin causes hepatotoxicity and orange discoloration of secretions. Ethambutol causes optic neuritis. Pyrazinamide causes hyperuricemia and hepatotoxicity.",
    s: "Respiratory"
  },
  {
    q: "A client with acute respiratory distress syndrome (ARDS) is mechanically ventilated. The nurse notes a PaO2/FiO2 ratio of 85. How does this classify the client's ARDS severity?",
    o: ["Severe ARDS", "Moderate ARDS", "Mild ARDS", "The client does not meet ARDS criteria"],
    a: 0,
    r: "ARDS severity is classified by PaO2/FiO2 ratio (Berlin criteria): mild 200-300, moderate 100-200, severe less than 100. A PaO2/FiO2 of 85 indicates severe ARDS. These clients typically require lung-protective ventilation with low tidal volumes (6 mL/kg ideal body weight), higher PEEP, and potentially prone positioning.",
    s: "Respiratory"
  },
  {
    q: "A client undergoes a thoracentesis for a large pleural effusion. Immediately after 1,500 mL of fluid is removed, the client develops a dry cough and chest tightness. What complication should the nurse suspect?",
    o: ["Re-expansion pulmonary edema", "Tension pneumothorax", "Hemothorax", "Air embolism"],
    a: 0,
    r: "Re-expansion pulmonary edema occurs when a large volume of pleural fluid is removed too rapidly, allowing the collapsed lung to re-expand quickly. This causes capillary leak and edema in the re-expanded lung. Maximum recommended removal is typically 1,000-1,500 mL at one time. Symptoms include cough, chest tightness, and dyspnea. Pneumothorax and hemothorax have different presentations.",
    s: "Respiratory"
  },
  {
    q: "A nurse is caring for a client with a tracheostomy who is being weaned from the ventilator. The nurse places a speaking valve on the tracheostomy tube. Which assessment is essential before placing the valve?",
    o: ["Ensure the tracheostomy cuff is fully deflated", "Confirm the tracheostomy cuff is fully inflated", "Verify the client has been suctioned within the past 4 hours", "Check that the client's SpO2 is above 98%"],
    a: 0,
    r: "A speaking valve (Passy-Muir valve) allows air to flow in through the tracheostomy during inspiration but closes on expiration, directing air upward through the vocal cords for speech. The cuff must be fully deflated to allow exhaled air to pass around the tube and through the upper airway. An inflated cuff with a speaking valve would trap air, causing respiratory distress.",
    s: "Respiratory"
  },
  {
    q: "A client with lung cancer develops syndrome of inappropriate antidiuretic hormone secretion (SIADH). Which laboratory findings should the nurse anticipate?",
    o: ["Serum sodium 118 mEq/L and serum osmolality 248 mOsm/kg", "Serum sodium 152 mEq/L and serum osmolality 310 mOsm/kg", "Serum potassium 5.8 mEq/L and serum creatinine 3.2 mg/dL", "Serum calcium 12.4 mg/dL and serum phosphorus 2.1 mg/dL"],
    a: 0,
    r: "SIADH causes excessive ADH secretion, leading to water retention and dilutional hyponatremia (low sodium) with concentrated urine and decreased serum osmolality. Small cell lung cancer is a common cause. Hypernatremia and hyperosmolality suggest diabetes insipidus. Hyperkalemia and elevated creatinine suggest renal failure. Hypercalcemia suggests paraneoplastic syndrome or bone metastasis.",
    s: "Respiratory"
  },
  {
    q: "A client is admitted with status asthmaticus. Despite continuous nebulized albuterol and IV corticosteroids, the client's respiratory status continues to deteriorate. SpO2 is 84% and breath sounds are nearly absent. What does the absence of wheezing indicate?",
    o: ["Severe bronchospasm with minimal air movement, a critical sign of impending respiratory failure", "The bronchospasm has resolved and the client is improving", "The albuterol has been effective in opening the airways", "The client has developed a pneumothorax"],
    a: 0,
    r: "In status asthmaticus, the absence of wheezing (silent chest) is an ominous sign indicating such severe bronchospasm that there is insufficient air movement to generate wheezing. This indicates impending respiratory arrest and the need for intubation. It does not indicate improvement. Pneumothorax would present with unilateral absent breath sounds, not bilateral.",
    s: "Respiratory"
  },
  {
    q: "A nurse is providing care for a client with cystic fibrosis. Which dietary recommendation should the nurse include in the plan of care?",
    o: ["High-calorie, high-protein diet with pancreatic enzyme supplementation", "Low-fat, low-sodium diet to reduce mucus production", "Fluid restriction to 1,500 mL per day", "High-fiber, low-protein diet to promote digestion"],
    a: 0,
    r: "Cystic fibrosis causes pancreatic insufficiency and increased metabolic demands from chronic infection and work of breathing. Clients need 120-150% of normal caloric intake, high protein, and pancreatic enzyme replacement (taken with all meals and snacks). Fat is not restricted; instead, fat-soluble vitamins (A, D, E, K) are supplemented. Adequate hydration is essential to thin secretions.",
    s: "Respiratory"
  },
  {
    q: "A client with obstructive sleep apnea is being educated about continuous positive airway pressure (CPAP) therapy. Which statement by the client indicates understanding?",
    o: ["I should wear the CPAP every night and during naps to keep my airway open while I sleep", "I only need to use the CPAP when I feel especially tired during the day", "The CPAP delivers oxygen to treat the low oxygen levels in my blood", "I can stop using the CPAP once my snoring improves"],
    a: 0,
    r: "CPAP delivers continuous positive pressure to maintain airway patency during sleep, preventing the airway collapse that causes apneic episodes. It must be used consistently during all sleep periods, including naps. Intermittent use is ineffective. CPAP delivers room air pressure, not supplemental oxygen. Snoring improvement does not mean the underlying OSA is resolved.",
    s: "Respiratory"
  },
  {
    q: "A client has a right lower lobe pneumonia. In which position should the nurse place the client for postural drainage of the affected lobe?",
    o: ["Prone with the foot of the bed elevated", "Right side-lying with the head of the bed flat", "High Fowler's position", "Left side-lying with the head of the bed elevated 30 degrees"],
    a: 0,
    r: "The right lower lobe is drained by positioning the client prone with the foot of the bed elevated, using gravity to move secretions from the lower lobes toward the larger airways where they can be expectorated or suctioned. Right side-lying would not effectively drain the right lower lobe. Upright positions are for upper lobe drainage.",
    s: "Respiratory"
  },
  {
    q: "A nurse is assessing a client with suspected pulmonary embolism. Which combination of findings would most strongly support this diagnosis?",
    o: ["Sudden-onset dyspnea, pleuritic chest pain, tachycardia, and low PaO2 with low PaCO2", "Gradual-onset dyspnea, productive cough with rust-colored sputum, and fever", "Barrel chest, prolonged expiratory phase, and pursed-lip breathing", "Orthopnea, bilateral crackles, S3 gallop, and peripheral edema"],
    a: 0,
    r: "Pulmonary embolism classically presents with sudden-onset dyspnea, pleuritic chest pain, tachycardia, and hypoxemia. ABG typically shows respiratory alkalosis (low PaCO2) from hyperventilation and hypoxemia (low PaO2). The second option describes pneumonia. The third describes COPD. The fourth describes heart failure.",
    s: "Respiratory"
  },
  {
    q: "A client with a laryngectomy is being prepared for discharge. Which safety instruction is most important for the nurse to include?",
    o: ["Never swim or allow water to enter the stoma as it goes directly to the lungs", "Avoid speaking for the first 6 months after surgery", "Sleep with the head of bed flat to promote drainage", "Cover the stoma only during cold weather"],
    a: 0,
    r: "After a total laryngectomy, the client breathes through a permanent stoma. Water entering the stoma goes directly into the trachea and lungs, making drowning a significant risk even in shallow water or showers. The stoma should always be covered with a filter to humidify and warm air and prevent foreign body aspiration. Speech rehabilitation can begin with alternative methods earlier.",
    s: "Respiratory"
  },
  {
    q: "A nurse is caring for a client receiving bilevel positive airway pressure (BiPAP). The settings are IPAP 14 cm H2O and EPAP 6 cm H2O. What is the effective pressure support being delivered?",
    o: ["8 cm H2O", "14 cm H2O", "20 cm H2O", "6 cm H2O"],
    a: 0,
    r: "Pressure support in BiPAP is calculated as the difference between IPAP (inspiratory positive airway pressure) and EPAP (expiratory positive airway pressure). 14 minus 6 equals 8 cm H2O of pressure support. This pressure difference assists the client's inspiratory effort, reducing the work of breathing. IPAP alone is the total inspiratory pressure, not the support.",
    s: "Respiratory"
  },
  // ===== NEUROLOGICAL (Questions 41-60) =====
  {
    q: "A client with a subarachnoid hemorrhage has an external ventricular drain (EVD). The nurse notes that the drainage has increased from 10 mL/hour to 50 mL/hour and the client becomes increasingly lethargic. What should the nurse do first?",
    o: ["Check the height of the EVD drainage system relative to the tragus of the ear", "Clamp the drain and notify the neurosurgeon immediately", "Lower the drain to increase CSF drainage", "Administer a bolus of IV mannitol"],
    a: 0,
    r: "Sudden increase in CSF drainage from an EVD can indicate the drain is positioned too low, causing overdrainage which can lead to collapse of ventricles and herniation. The first step is checking the system height, which should be leveled to the tragus of the ear (external auditory meatus). Clamping without assessment may cause dangerous ICP elevation. Lowering would worsen overdrainage.",
    s: "Neurological"
  },
  {
    q: "A client presents with sudden onset of right-sided facial droop, arm drift, and slurred speech. The time of symptom onset was 90 minutes ago. CT scan shows no hemorrhage. Which treatment should the nurse anticipate?",
    o: ["IV alteplase (tPA) administration within the 4.5-hour window", "Emergent surgical clipping of the aneurysm", "IV heparin bolus followed by continuous infusion", "Oral aspirin 325 mg and observation"],
    a: 0,
    r: "This presentation is consistent with acute ischemic stroke, confirmed by CT showing no hemorrhage. IV alteplase is the gold standard for acute ischemic stroke when given within 4.5 hours of symptom onset. At 90 minutes, the client is within the treatment window. Surgical clipping is for aneurysms. Heparin is not first-line for acute stroke. Aspirin alone is insufficient as primary treatment.",
    s: "Neurological"
  },
  {
    q: "A nurse is caring for a client with increased intracranial pressure (ICP). Which nursing intervention is contraindicated?",
    o: ["Clustering nursing care activities together", "Elevating the head of bed to 30 degrees", "Maintaining the head and neck in neutral alignment", "Providing a quiet, dimly lit environment"],
    a: 0,
    r: "Clustering care activities increases ICP by providing continuous stimulation without recovery time. Care should be spaced to allow ICP to return to baseline between activities. HOB elevation promotes venous drainage. Neutral head alignment prevents jugular vein compression. A quiet, dark environment reduces stimulation that could raise ICP.",
    s: "Neurological"
  },
  {
    q: "A client with Guillain-Barre syndrome is admitted with progressive ascending weakness that started in the lower extremities 3 days ago. Which assessment is the nurse's highest priority?",
    o: ["Respiratory function including vital capacity and rate", "Deep tendon reflexes in all extremities", "Level of consciousness and orientation", "Ability to swallow and gag reflex"],
    a: 0,
    r: "Guillain-Barre syndrome causes ascending paralysis that can progress to respiratory muscle involvement, leading to respiratory failure. Monitoring vital capacity and respiratory rate is the highest priority because mechanical ventilation may be needed if vital capacity drops below 15-20 mL/kg. While DTRs, LOC, and swallowing are important, respiratory failure is the life-threatening concern.",
    s: "Neurological"
  },
  {
    q: "A client with myasthenia gravis is experiencing a myasthenic crisis. Which intervention is appropriate?",
    o: ["Administer IV edrophonium (Tensilon) to differentiate crisis type, followed by neostigmine if confirmed", "Administer IV atropine to reverse cholinergic excess", "Withhold all anticholinesterase medications permanently", "Increase physical activity to strengthen weakened muscles"],
    a: 0,
    r: "In myasthenic crisis, there is insufficient acetylcholinesterase inhibition, causing severe weakness. An edrophonium (Tensilon) test can differentiate myasthenic from cholinergic crisis. If symptoms improve with edrophonium, the crisis is myasthenic and requires increased anticholinesterase medication. Atropine treats cholinergic crisis. Permanently withholding medications worsens myasthenic crisis. Exercise worsens weakness.",
    s: "Neurological"
  },
  {
    q: "A nurse is assessing a client with a C4 spinal cord injury who was admitted 2 hours ago. The client's blood pressure is 78/48, heart rate is 52, and skin is warm and dry below the level of injury. What type of shock should the nurse suspect?",
    o: ["Neurogenic shock", "Hypovolemic shock", "Cardiogenic shock", "Septic shock"],
    a: 0,
    r: "Neurogenic shock results from loss of sympathetic tone below the level of spinal cord injury, causing vasodilation (hypotension, warm/dry skin) and unopposed vagal tone (bradycardia). This triad of hypotension, bradycardia, and warm skin is classic. Hypovolemic shock presents with tachycardia and cool, clammy skin. Cardiogenic shock presents with JVD and pulmonary congestion. Septic shock usually involves fever and tachycardia.",
    s: "Neurological"
  },
  {
    q: "A client with a T6 spinal cord injury suddenly develops a severe headache, blood pressure of 210/118, heart rate of 48, flushed face, and nasal congestion. What should the nurse do first?",
    o: ["Sit the client upright and check for a distended bladder or fecal impaction", "Administer IV antihypertensives immediately", "Lay the client flat and elevate the legs", "Apply cold compresses to the forehead and neck"],
    a: 0,
    r: "This presentation is autonomic dysreflexia, a life-threatening condition triggered by noxious stimuli below the level of injury (most commonly bladder distension or bowel impaction). The first action is to sit the client upright to lower BP through orthostatic effect, then identify and remove the trigger. A kinked catheter or full bladder is the most common cause. Laying flat would worsen hypertension.",
    s: "Neurological"
  },
  {
    q: "A client with bacterial meningitis is being assessed. Which combination of findings is most consistent with this diagnosis?",
    o: ["Nuchal rigidity, photophobia, positive Kernig sign, and petechial rash", "Unilateral headache with visual aura and nausea", "Bilateral lower extremity weakness with bladder retention", "Sudden onset of worst headache of life with loss of consciousness"],
    a: 0,
    r: "Bacterial meningitis presents with meningeal irritation signs: nuchal rigidity (stiff neck), photophobia, positive Kernig sign (pain with leg extension when hip is flexed), and Brudzinski sign (involuntary hip flexion with neck flexion). A petechial rash suggests meningococcal meningitis. Migraine causes unilateral headache with aura. The third option suggests spinal cord compression. Thunderclap headache suggests SAH.",
    s: "Neurological"
  },
  {
    q: "A client with epilepsy is brought to the emergency department in status epilepticus. The seizure has been ongoing for 8 minutes. Which medication should the nurse administer first?",
    o: ["IV lorazepam", "IV phenytoin", "IV valproic acid", "IV levetiracetam"],
    a: 0,
    r: "IV benzodiazepines (lorazepam or diazepam) are the first-line treatment for status epilepticus per AES guidelines. Lorazepam is preferred due to its longer duration of action in the CNS. If benzodiazepines fail, second-line agents include fosphenytoin, valproic acid, or levetiracetam. Phenytoin requires careful monitoring for cardiac arrhythmias during administration.",
    s: "Neurological"
  },
  {
    q: "A nurse is monitoring a client with a traumatic brain injury. The ICP monitor reads 28 mmHg and the MAP is 80 mmHg. What is the cerebral perfusion pressure, and does it require intervention?",
    o: ["CPP is 52 mmHg; yes, this is below the critical threshold and requires intervention", "CPP is 108 mmHg; no, this is within normal limits", "CPP is 28 mmHg; yes, this is critically low", "CPP is 52 mmHg; no, this is adequate"],
    a: 0,
    r: "CPP = MAP minus ICP = 80 minus 28 = 52 mmHg. The target CPP for TBI patients is 60-70 mmHg (Brain Trauma Foundation guidelines). A CPP below 60 mmHg indicates inadequate cerebral perfusion and requires intervention to either increase MAP (vasopressors, fluids) or decrease ICP (osmotic therapy, CSF drainage, positioning).",
    s: "Neurological"
  },
  {
    q: "A client 4 hours post-craniotomy for tumor removal suddenly becomes unresponsive. The nurse notes a fixed, dilated left pupil and decorticate posturing. What does the nurse suspect?",
    o: ["Uncal herniation from expanding intracranial hematoma", "Seizure with postictal state", "Opioid overdose from pain medication", "Hypoglycemic episode"],
    a: 0,
    r: "A fixed, dilated pupil on one side (ipsilateral to the lesion) with declining consciousness and posturing after craniotomy strongly suggests uncal herniation from an expanding intracranial hematoma compressing cranial nerve III. This is a neurosurgical emergency. Seizures typically involve tonic-clonic movements. Opioid overdose causes bilateral pinpoint pupils. Hypoglycemia causes altered consciousness but not fixed pupil.",
    s: "Neurological"
  },
  {
    q: "A nurse is caring for a client with Parkinson's disease who is prescribed carbidopa-levodopa. The client reports that the medication seems to stop working 30 minutes before the next dose is due, with increased tremor and rigidity. What is this phenomenon called?",
    o: ["End-of-dose wearing off (motor fluctuation)", "On-off phenomenon", "Neuroleptic malignant syndrome", "Drug holiday effect"],
    a: 0,
    r: "End-of-dose wearing off occurs when the therapeutic effect of carbidopa-levodopa diminishes before the next scheduled dose, causing a return of Parkinson symptoms. This is common with long-term levodopa use as dopamine storage capacity decreases. The on-off phenomenon involves unpredictable fluctuations unrelated to dosing schedule. NMS is a dangerous reaction to dopamine antagonists.",
    s: "Neurological"
  },
  {
    q: "A client with multiple sclerosis reports worsening fatigue, visual changes, and numbness. The nurse reviews the MRI results showing new demyelinating lesions. Which medication is used specifically to modify the disease course?",
    o: ["Interferon beta-1a (Avonex)", "Baclofen", "Prednisone", "Gabapentin"],
    a: 0,
    r: "Interferon beta-1a is a disease-modifying therapy (DMT) for relapsing-remitting MS that reduces the frequency and severity of relapses and slows disease progression. Baclofen treats spasticity. Prednisone is used for acute exacerbations but does not modify disease course. Gabapentin treats neuropathic pain but does not affect disease progression.",
    s: "Neurological"
  },
  {
    q: "A nurse is performing the Glasgow Coma Scale assessment on a client. The client opens eyes to painful stimuli, makes incomprehensible sounds, and withdraws from pain. What is the GCS score?",
    o: ["8", "6", "10", "12"],
    a: 0,
    r: "GCS scoring: Eye opening to pain = 2, Incomprehensible sounds = 2, Withdrawal from pain = 4. Total = 2 + 2 + 4 = 8. A GCS of 8 or below generally indicates severe brain injury and the need for intubation and airway protection. The minimum GCS is 3 and maximum is 15.",
    s: "Neurological"
  },
  {
    q: "A client has a right-hemisphere stroke. Which deficit should the nurse expect?",
    o: ["Left-sided neglect (unilateral neglect of the left visual field and body)", "Expressive aphasia (Broca's aphasia)", "Right-sided hemiplegia", "Difficulty with mathematical calculations"],
    a: 0,
    r: "Right-hemisphere strokes characteristically cause left-sided neglect (inattention to the left side of the body and environment), left-sided hemiplegia, impaired spatial perception, and impulsive behavior. Expressive aphasia occurs with left hemisphere damage (dominant hemisphere). Right-sided hemiplegia occurs with left hemisphere strokes. Mathematical difficulty is typically a left hemisphere function.",
    s: "Neurological"
  },
  {
    q: "A nurse is administering IV phenytoin to a client with seizures. Which IV solution should the nurse use to dilute this medication?",
    o: ["Normal saline (0.9% sodium chloride)", "5% dextrose in water (D5W)", "Lactated Ringer's solution", "5% dextrose in 0.45% sodium chloride"],
    a: 0,
    r: "IV phenytoin must only be mixed with normal saline. It precipitates in dextrose-containing solutions, forming crystals that can cause phlebitis and embolism. Additionally, phenytoin must be administered slowly (no faster than 50 mg/min in adults) with continuous cardiac monitoring due to the risk of hypotension and cardiac arrhythmias. An inline filter should be used.",
    s: "Neurological"
  },
  {
    q: "A client with a lumbar spinal cord injury at L3-L4 is admitted. Which functional ability should the nurse expect this client to retain?",
    o: ["Upper body function, hip flexion, and some knee extension", "Full lower extremity function and independent ambulation", "Only upper extremity function with complete paraplegia", "Respiratory independence but no voluntary leg movement"],
    a: 0,
    r: "L3-L4 injury preserves upper body function, hip flexion (L1-L3), and some knee extension (L3-L4). The client would have partial lower extremity function and may ambulate with assistive devices. Complete paraplegia occurs with higher thoracic injuries. Full function would require no SCI. L3-L4 preserves more lower extremity function than higher lumbar injuries.",
    s: "Neurological"
  },
  {
    q: "A nurse is caring for a client with trigeminal neuralgia. Which intervention should the nurse include in the plan of care to minimize pain episodes?",
    o: ["Serve food and beverages at room temperature and avoid drafts on the face", "Apply warm compresses to the affected side of the face three times daily", "Encourage the client to brush teeth vigorously to maintain oral hygiene", "Position the client on the affected side to reduce nerve compression"],
    a: 0,
    r: "Trigeminal neuralgia causes severe, stabbing facial pain triggered by sensory stimulation such as temperature extremes, wind/drafts on the face, chewing, or touching. Serving food at room temperature and avoiding drafts reduces trigger exposure. Warm compresses may trigger pain. Vigorous tooth brushing is a known trigger. Lying on the affected side could trigger an episode.",
    s: "Neurological"
  },
  {
    q: "A client with amyotrophic lateral sclerosis (ALS) is being seen in the neurology clinic. The client asks what to expect as the disease progresses. Which response by the nurse is most accurate?",
    o: ["You will experience progressive muscle weakness, but your cognitive function will remain intact", "You will have episodes of muscle weakness that will improve and then worsen over time", "The disease primarily affects your ability to think clearly and remember things", "With proper medication, the disease progression can be completely stopped"],
    a: 0,
    r: "ALS is a progressive neurodegenerative disease affecting upper and lower motor neurons, causing progressive muscle weakness, atrophy, fasciculations, and eventually respiratory failure. Cognitive function is typically preserved. ALS is not relapsing-remitting like MS. It does not primarily affect cognition. There is no cure; riluzole may slow progression modestly but does not stop it.",
    s: "Neurological"
  },
  {
    q: "A client with a new diagnosis of generalized tonic-clonic seizures is prescribed levetiracetam (Keppra). Which side effect should the nurse educate the client about?",
    o: ["Behavioral changes including irritability, mood swings, and aggression", "Severe hepatotoxicity requiring monthly liver function tests", "Stevens-Johnson syndrome rash within the first 2 weeks", "Aplastic anemia requiring weekly complete blood counts"],
    a: 0,
    r: "Levetiracetam commonly causes behavioral and psychiatric side effects including irritability, mood changes, aggression, anxiety, and depression. Clients and families should be counseled to report these changes. Severe hepatotoxicity is more associated with valproic acid. Stevens-Johnson syndrome is more associated with lamotrigine. Aplastic anemia is more associated with carbamazepine.",
    s: "Neurological"
  },
  // ===== GASTROINTESTINAL (Questions 61-80) =====
  {
    q: "A client with cirrhosis develops hepatic encephalopathy with ammonia level of 142 mcg/dL. Which medication should the nurse anticipate administering?",
    o: ["Lactulose 30 mL every 2 hours until 2-3 soft stools per day are achieved", "Furosemide 40 mg IV to reduce fluid overload", "Albumin 25% IV infusion", "Omeprazole 40 mg IV to prevent stress ulcers"],
    a: 0,
    r: "Lactulose is the first-line treatment for hepatic encephalopathy. It works by converting ammonia to ammonium in the colon, which cannot be reabsorbed, and acts as an osmotic laxative to promote fecal excretion of ammonia. The goal is 2-3 soft stools per day. Rifaximin is often added as adjunct therapy. The other medications do not address the elevated ammonia causing encephalopathy.",
    s: "Gastrointestinal"
  },
  {
    q: "A client with a nasogastric tube connected to low intermittent suction reports nausea. The nurse notes the NG tube has not drained any fluid in the past 4 hours. What should the nurse do first?",
    o: ["Check tube placement and irrigate with 30 mL of normal saline per protocol", "Remove the NG tube and insert a new one", "Administer IV ondansetron for nausea", "Increase the suction to continuous high"],
    a: 0,
    r: "An NG tube that stops draining may be occluded or displaced. The nurse should first verify placement (check markings, auscultate, aspirate for gastric contents) and then irrigate with 30 mL normal saline to clear any obstruction. Removing the tube is premature. Treating nausea without addressing the non-functioning tube ignores the underlying problem. High suction can damage gastric mucosa.",
    s: "Gastrointestinal"
  },
  {
    q: "A client who underwent a total gastrectomy 2 weeks ago reports feeling dizzy, diaphoretic, and nauseated 15 minutes after eating. Heart rate is 108 bpm. What is the nurse's assessment?",
    o: ["Dumping syndrome from rapid emptying of hyperosmolar food into the jejunum", "Postoperative hemorrhage at the surgical site", "Bowel obstruction from adhesion formation", "Anastomotic leak requiring surgical intervention"],
    a: 0,
    r: "Early dumping syndrome occurs 15-30 minutes after eating when hyperosmolar food rapidly enters the small intestine, drawing fluid from the vascular space into the bowel lumen. This causes distension, cramping, diarrhea, and vasomotor symptoms (dizziness, tachycardia, diaphoresis). Management includes small, frequent meals; avoiding simple sugars; lying down after eating; and separating liquids from solids.",
    s: "Gastrointestinal"
  },
  {
    q: "A nurse is assessing a client with acute pancreatitis. Which finding is most characteristic of this condition?",
    o: ["Severe epigastric pain radiating to the back that improves when leaning forward", "Right lower quadrant pain with rebound tenderness", "Cramping abdominal pain relieved by bowel movement", "Diffuse abdominal pain that worsens with palpation in all quadrants"],
    a: 0,
    r: "Acute pancreatitis causes severe, boring epigastric pain that radiates to the back. Pain is characteristically relieved by leaning forward (knee-chest position), which takes pressure off the inflamed pancreas. RLQ pain with rebound suggests appendicitis. Cramping relieved by bowel movement suggests IBS. Diffuse tenderness in all quadrants suggests peritonitis.",
    s: "Gastrointestinal"
  },
  {
    q: "A client with Crohn's disease has been taking prednisone 40 mg daily for 6 weeks. The provider orders a taper to discontinue the medication. The client asks why the medication cannot be stopped immediately. What is the nurse's best explanation?",
    o: ["Suddenly stopping can cause adrenal crisis because your body has reduced its own cortisol production", "The medication needs time to clear from your bloodstream completely", "Stopping abruptly would cause the Crohn's disease to flare immediately", "The prednisone has weakened your immune system and needs time to recover"],
    a: 0,
    r: "Prolonged corticosteroid use (more than 2-3 weeks) suppresses the hypothalamic-pituitary-adrenal (HPA) axis, reducing endogenous cortisol production. Abrupt discontinuation can cause acute adrenal insufficiency (adrenal crisis) with hypotension, shock, and potentially death. Gradual tapering allows the adrenal glands to resume normal cortisol production.",
    s: "Gastrointestinal"
  },
  {
    q: "A nurse is caring for a client with a newly placed percutaneous endoscopic gastrostomy (PEG) tube. Which intervention is appropriate for the first 24 hours after placement?",
    o: ["Keep the external bumper snug but not tight against the skin and monitor the site for bleeding", "Begin full-strength formula feedings at the prescribed rate immediately", "Flush the tube with carbonated beverages to maintain patency", "Rotate the tube 360 degrees every 4 hours to prevent tissue adhesion"],
    a: 0,
    r: "In the first 24 hours, the PEG site should be monitored for bleeding, leakage, and signs of infection. The external bumper should be snug but not tight to prevent pressure necrosis. Feedings are typically held for 4-24 hours post-placement to allow the tract to begin healing. Water is used for flushing, not carbonated beverages. Rotation is not performed in the immediate post-placement period.",
    s: "Gastrointestinal"
  },
  {
    q: "A client with ulcerative colitis is admitted with bloody diarrhea, abdominal distension, and fever. An abdominal X-ray shows colonic dilation of 8 cm. What complication should the nurse be most concerned about?",
    o: ["Toxic megacolon with risk of perforation", "Small bowel obstruction", "Ischemic colitis", "Sigmoid volvulus"],
    a: 0,
    r: "Toxic megacolon is a life-threatening complication of ulcerative colitis characterized by non-obstructive colonic dilation greater than 6 cm with systemic toxicity (fever, tachycardia, leukocytosis). Risk of perforation and sepsis is high. Treatment includes bowel rest, IV antibiotics, and potentially emergent colectomy. The clinical picture with ulcerative colitis history makes the other options less likely.",
    s: "Gastrointestinal"
  },
  {
    q: "A client presents to the emergency department with hematemesis. Assessment reveals orthostatic hypotension (BP sitting 118/72, standing 86/54), HR 112, and cool, clammy skin. Which intervention is the priority?",
    o: ["Establish two large-bore IV lines and begin volume resuscitation with crystalloids", "Insert a nasogastric tube and begin gastric lavage", "Administer IV pantoprazole 80 mg bolus", "Prepare the client for emergent endoscopy"],
    a: 0,
    r: "Hematemesis with orthostatic hypotension, tachycardia, and signs of poor perfusion indicates significant upper GI bleeding with hypovolemia. The immediate priority is establishing IV access with large-bore catheters and beginning aggressive fluid resuscitation to restore circulating volume. NG tube, proton pump inhibitors, and endoscopy are important but secondary to hemodynamic stabilization.",
    s: "Gastrointestinal"
  },
  {
    q: "A client with cholelithiasis reports severe right upper quadrant pain after eating a high-fat meal. The pain radiates to the right scapula and is accompanied by nausea and vomiting. What should the nurse anticipate?",
    o: ["NPO status, IV fluids, pain management, and preparation for cholecystectomy", "Administration of oral ursodeoxycholic acid to dissolve the gallstones", "High-fat diet to stimulate bile flow and flush the stones", "Lithotripsy to break up the gallstones"],
    a: 0,
    r: "Acute biliary colic with right upper quadrant pain radiating to the right scapula (referred pain via the phrenic nerve) triggered by fatty food intake is the classic presentation. Management includes NPO status to rest the GI tract, IV fluids for hydration, analgesics (ketorolac or meperidine, avoiding morphine which can cause sphincter of Oddi spasm), and cholecystectomy is the definitive treatment.",
    s: "Gastrointestinal"
  },
  {
    q: "A nurse is teaching a client about celiac disease management. Which food item should the nurse instruct the client to avoid?",
    o: ["Whole wheat bread", "Brown rice", "Corn tortillas", "Baked potatoes"],
    a: 0,
    r: "Celiac disease requires strict avoidance of gluten, which is found in wheat, barley, and rye. Whole wheat bread contains gluten. Brown rice, corn, and potatoes are naturally gluten-free and safe for celiac clients. Reading labels carefully is essential because gluten is hidden in many processed foods, sauces, and seasonings.",
    s: "Gastrointestinal"
  },
  {
    q: "A client with a colostomy asks the nurse about foods that may help thicken the stool output. Which food should the nurse recommend?",
    o: ["Applesauce and bananas", "Raw vegetables and bran cereal", "Prune juice and coffee", "Spicy foods and dairy products"],
    a: 0,
    r: "Applesauce, bananas, rice, cheese, and toast are stool-thickening foods recommended for ostomy clients with loose output. Raw vegetables and bran add fiber and can increase output volume. Prune juice and coffee are known to increase peristalsis and loosen stool. Spicy foods and dairy can cause gas and diarrhea in many clients.",
    s: "Gastrointestinal"
  },
  {
    q: "A client post-liver biopsy is positioned on the right side with a pillow against the biopsy site. The client reports sharp right shoulder pain. What should the nurse suspect?",
    o: ["Referred pain from diaphragmatic irritation, possibly indicating bile leak or hemorrhage", "Musculoskeletal pain from lying in one position", "Anxiety-related chest pain", "Pulmonary embolism"],
    a: 0,
    r: "Right shoulder pain after liver biopsy is referred pain from irritation of the diaphragm by blood or bile leaking from the biopsy site. The phrenic nerve (C3-C5) innervates the diaphragm, and irritation refers pain to the shoulder. This requires immediate assessment for hemorrhage including vital signs, hemoglobin check, and provider notification. Positional pain would not be referred to the shoulder.",
    s: "Gastrointestinal"
  },
  {
    q: "A nurse is preparing a client with esophageal varices for balloon tamponade with a Sengstaken-Blakemore tube. Which complication should the nurse monitor for most closely?",
    o: ["Airway obstruction from balloon migration", "Hypokalemia from gastric suctioning", "Fluid volume overload from IV infusions", "Infection at the insertion site"],
    a: 0,
    r: "The most dangerous complication of a Sengstaken-Blakemore tube is airway obstruction from upward migration of the esophageal balloon. If the gastric balloon deflates, the entire tube can migrate upward, occluding the airway. Scissors should be kept at the bedside to cut the tube and immediately deflate the balloons if airway obstruction occurs.",
    s: "Gastrointestinal"
  },
  {
    q: "A client with hepatitis B asks the nurse how the infection is transmitted. Which response by the nurse is most accurate?",
    o: ["Hepatitis B is transmitted through contact with infected blood, sexual contact, and from mother to baby during birth", "Hepatitis B is spread by the fecal-oral route through contaminated food and water", "Hepatitis B is transmitted through respiratory droplets during coughing and sneezing", "Hepatitis B is spread by mosquito bites in tropical regions"],
    a: 0,
    r: "Hepatitis B is a bloodborne virus transmitted through percutaneous or mucosal exposure to infected blood and body fluids. Major routes include sexual contact, needle sharing, occupational needlestick injuries, and perinatal (mother-to-child) transmission. Fecal-oral route transmits hepatitis A and E. HBV is not airborne or vector-borne.",
    s: "Gastrointestinal"
  },
  {
    q: "A client has a small bowel obstruction with persistent vomiting. ABG results show: pH 7.52, PaCO2 42 mmHg, HCO3 33 mEq/L. How should the nurse interpret these results?",
    o: ["Metabolic alkalosis from loss of gastric acid (hydrochloric acid)", "Respiratory alkalosis from hyperventilation", "Metabolic acidosis from dehydration", "Mixed acid-base disorder"],
    a: 0,
    r: "Persistent vomiting causes loss of hydrochloric acid (HCl) from the stomach, leading to metabolic alkalosis (elevated pH, elevated HCO3, normal PaCO2). Hypokalemia and hypochloremia also contribute to maintaining the alkalosis. The PaCO2 is normal, indicating no respiratory compensation yet. Treatment includes IV normal saline and potassium replacement.",
    s: "Gastrointestinal"
  },
  {
    q: "A client with a history of alcohol use disorder presents with ascites, jaundice, and spider angiomas. The nurse plans to assist with a paracentesis. Which assessment is most important before the procedure?",
    o: ["Verify the client has emptied the bladder to reduce risk of bladder puncture", "Check the client's allergy status for iodine", "Ensure the client has been NPO for 8 hours", "Obtain a baseline weight and abdominal girth measurement"],
    a: 0,
    r: "Before paracentesis, the client must void to decompress the bladder and reduce the risk of inadvertent bladder perforation during the procedure. A distended bladder can be easily punctured during needle insertion. While baseline weight and girth are important for monitoring, bladder emptying is a safety priority. NPO status is not required for paracentesis.",
    s: "Gastrointestinal"
  },
  {
    q: "A nurse is educating a client about taking pancreatic enzyme replacement capsules (pancrelipase). Which instruction is most important?",
    o: ["Take the capsules with meals and snacks, and do not crush or chew the enteric-coated beads", "Take the capsules on an empty stomach 1 hour before meals", "Take the capsules only when eating high-fat foods", "Crush the capsules and mix with hot food for better absorption"],
    a: 0,
    r: "Pancreatic enzymes must be taken with all meals and snacks to aid in digestion of fats, proteins, and carbohydrates. The enteric coating protects the enzymes from gastric acid; crushing or chewing destroys this protection and can cause oral mucosal ulceration. Enzymes taken on an empty stomach have nothing to digest. They should not be mixed with hot foods as heat inactivates the enzymes.",
    s: "Gastrointestinal"
  },
  {
    q: "A client with inflammatory bowel disease is prescribed infliximab (Remicade). Which assessment is essential before starting this medication?",
    o: ["Tuberculosis screening with PPD skin test or interferon-gamma release assay", "Hepatitis A immunity verification", "Baseline ECG to rule out cardiac conduction abnormalities", "Pregnancy test within the past month"],
    a: 0,
    r: "Infliximab is a TNF-alpha inhibitor that suppresses immune function and can reactivate latent tuberculosis. TB screening is mandatory before starting any TNF inhibitor. If latent TB is detected, treatment for TB must begin before infliximab can be initiated. While hepatitis B screening is also important, TB screening is the most critical pre-treatment assessment for TNF inhibitors.",
    s: "Gastrointestinal"
  },
  {
    q: "A client with severe acute pancreatitis has a Ranson score of 6 on admission. The nurse should recognize that this indicates:",
    o: ["High mortality risk requiring ICU-level monitoring and aggressive supportive care", "Mild pancreatitis with expected full recovery", "Moderate pancreatitis requiring standard medical management", "The client is a candidate for early surgical intervention"],
    a: 0,
    r: "Ranson criteria predict severity and mortality in acute pancreatitis. A score of 0-2 indicates mild disease with less than 5% mortality. A score of 3-4 indicates about 15-20% mortality. A score of 5-6 indicates 40% mortality. A score greater than 6 approaches 100% mortality. A score of 6 indicates very severe disease requiring ICU-level care with close monitoring for complications like necrotizing pancreatitis, ARDS, and multiorgan failure.",
    s: "Gastrointestinal"
  },
  {
    q: "A client is scheduled for a colonoscopy and asks why the bowel preparation is necessary. What is the nurse's best response?",
    o: ["The preparation clears the colon so the physician can see the lining clearly and detect any abnormalities", "The preparation sterilizes the bowel to prevent infection during the procedure", "The preparation reduces the size of the colon for easier insertion of the scope", "The preparation numbs the intestinal lining to reduce discomfort during the procedure"],
    a: 0,
    r: "Bowel preparation removes fecal matter to provide clear visualization of the colonic mucosa during colonoscopy. This is essential for detecting polyps, tumors, inflammation, and other abnormalities. Poor preparation can obscure findings and require repeat procedures. The prep does not sterilize, reduce colon size, or provide anesthesia.",
    s: "Gastrointestinal"
  },
  // ===== RENAL/GENITOURINARY (Questions 81-100) =====
  {
    q: "A client with end-stage renal disease on hemodialysis has a serum potassium of 6.8 mEq/L. The cardiac monitor shows peaked T waves. Which intervention should the nurse perform first?",
    o: ["Administer IV calcium gluconate as ordered to protect the heart", "Administer kayexalate orally", "Prepare the client for emergent dialysis", "Administer IV insulin with dextrose"],
    a: 0,
    r: "With hyperkalemia of 6.8 and ECG changes (peaked T waves), IV calcium gluconate is the first-line intervention as it stabilizes the cardiac membrane to prevent lethal dysrhythmias. It does not lower potassium levels but provides immediate cardiac protection. IV insulin with dextrose shifts potassium intracellularly. Dialysis definitively removes potassium but takes time to arrange. Kayexalate works slowly.",
    s: "Renal"
  },
  {
    q: "A nurse is caring for a client with a new arteriovenous fistula (AVF) in the left forearm for hemodialysis. Which instruction should the nurse provide?",
    o: ["Avoid blood pressure measurements, IV insertions, and blood draws in the left arm", "Apply tight bandages to the fistula site to promote maturation", "Keep the left arm immobilized at all times", "Sleep on the left side to increase blood flow to the fistula"],
    a: 0,
    r: "The AVF arm must be protected to preserve the vascular access. Blood pressure measurements, IV insertions, blood draws, and tight clothing or jewelry on the access arm can damage the fistula or cause thrombosis. The nurse should assess for a thrill (palpable vibration) and bruit (audible sound with stethoscope) each shift to confirm patency. Compression and immobilization can occlude the fistula.",
    s: "Renal",
    image: imgAVFistulaExam
  },
  {
    q: "A client with chronic kidney disease has the following laboratory results: calcium 7.2 mg/dL, phosphorus 6.8 mg/dL, and PTH 890 pg/mL. These findings are consistent with:",
    o: ["Secondary hyperparathyroidism (renal osteodystrophy)", "Primary hyperparathyroidism", "Hypoparathyroidism", "Vitamin D toxicity"],
    a: 0,
    r: "In CKD, the kidneys cannot activate vitamin D or excrete phosphorus, leading to hypocalcemia and hyperphosphatemia. The parathyroid glands respond by secreting excess PTH (secondary hyperparathyroidism) to raise calcium levels, causing bone resorption (renal osteodystrophy). Primary hyperparathyroidism has high calcium. Hypoparathyroidism has low PTH. Vitamin D toxicity causes hypercalcemia.",
    s: "Renal"
  },
  {
    q: "A nurse is monitoring urine output for a client with acute kidney injury (AKI). In the oliguric phase, which finding should the nurse expect?",
    o: ["Urine output less than 400 mL per 24 hours with elevated BUN and creatinine", "Urine output greater than 3 liters per 24 hours", "Normal urine output with hematuria", "Polyuria with dilute urine"],
    a: 0,
    r: "The oliguric phase of AKI is characterized by urine output less than 400 mL/day (or less than 0.5 mL/kg/hour), rising BUN and creatinine, hyperkalemia, fluid overload, and metabolic acidosis. This phase typically lasts 1-3 weeks. Greater than 3 L/day is the diuretic phase. Normal output with hematuria suggests glomerulonephritis. Polyuria with dilute urine is the diuretic/recovery phase.",
    s: "Renal"
  },
  {
    q: "A client with a ureteral stent reports hematuria and bladder spasms after the procedure. Which response by the nurse is most appropriate?",
    o: ["Mild hematuria and bladder spasms are expected and should improve over a few days", "These symptoms indicate the stent has migrated and needs to be repositioned immediately", "You should avoid drinking fluids to reduce the hematuria", "I will contact the provider for immediate stent removal"],
    a: 0,
    r: "Mild hematuria, bladder spasms, urgency, and frequency are common expected side effects of ureteral stent placement. Symptoms typically improve over several days. Increased fluid intake is encouraged to flush the urinary tract. Stent migration would present with increasing pain and obstruction symptoms. Fluid restriction would worsen hematuria. Immediate removal is not indicated for expected symptoms.",
    s: "Renal"
  },
  {
    q: "A client with nephrotic syndrome presents with generalized edema, proteinuria of 5.2 g/day, serum albumin of 1.8 g/dL, and hyperlipidemia. Which dietary modification should the nurse recommend?",
    o: ["Moderate protein intake with sodium restriction", "High protein intake to replace lost protein", "Fluid restriction to less than 500 mL per day", "Unlimited sodium intake to maintain intravascular volume"],
    a: 0,
    r: "Nephrotic syndrome management includes moderate protein intake (0.8-1 g/kg/day) to avoid worsening proteinuria, sodium restriction (less than 2 g/day) to reduce edema, and statin therapy for hyperlipidemia. High protein intake was previously recommended but is now known to increase glomerular filtration pressure and worsen proteinuria. Severe fluid restriction is usually not necessary. Sodium restriction is essential.",
    s: "Renal"
  },
  {
    q: "A nurse is assessing a client after a kidney transplant. Which finding would suggest acute rejection?",
    o: ["Fever, decreased urine output, tenderness over the graft site, and rising creatinine", "Gradual decrease in kidney function over months to years", "Immediate dark urine and severe flank pain in the operating room", "Weight loss, polyuria, and decreased blood pressure"],
    a: 0,
    r: "Acute rejection typically occurs within weeks to months after transplant and presents with fever, graft tenderness, decreased urine output, weight gain from fluid retention, elevated BUN and creatinine, and hypertension. Gradual decline over months to years suggests chronic rejection. Immediate rejection in the OR is hyperacute rejection. Weight loss with polyuria does not suggest rejection.",
    s: "Renal"
  },
  {
    q: "A client on peritoneal dialysis has cloudy dialysate effluent and reports abdominal pain and fever. What does the nurse suspect, and what specimens should be collected?",
    o: ["Peritonitis; collect a sample of the effluent for culture and Gram stain", "Normal dialysis response; no further action needed", "Bowel perforation; prepare for emergent surgery", "Urinary tract infection; collect a midstream urine specimen"],
    a: 0,
    r: "Cloudy effluent with abdominal pain and fever is the classic presentation of peritonitis in peritoneal dialysis, the most common serious complication. A sample of the effluent must be collected for cell count, Gram stain, and culture before starting empiric intraperitoneal antibiotics. Cloudy effluent is never normal. While bowel perforation is possible, peritonitis from contamination is far more common.",
    s: "Renal"
  },
  {
    q: "A client with a calcium oxalate kidney stone asks the nurse about dietary modifications to prevent recurrence. Which recommendation should the nurse include?",
    o: ["Increase fluid intake to at least 2.5 liters per day and limit high-oxalate foods like spinach, rhubarb, and tea", "Restrict all dairy products to reduce calcium intake", "Follow a high-protein diet to acidify the urine", "Limit water intake to concentrate the urine and flush stones"],
    a: 0,
    r: "For calcium oxalate stones, increasing fluid intake to produce at least 2.5 L of urine daily is the most important intervention. Limiting high-oxalate foods (spinach, rhubarb, nuts, tea, chocolate) reduces stone-forming substrate. Restricting dietary calcium is no longer recommended as it paradoxically increases stone risk. High protein and fluid restriction promote stone formation.",
    s: "Renal"
  },
  {
    q: "A nurse is assessing a male client with benign prostatic hyperplasia (BPH). Which symptom pattern is most characteristic?",
    o: ["Urinary hesitancy, weak stream, frequency, nocturia, and sensation of incomplete emptying", "Acute onset of severe flank pain radiating to the groin", "Painless hematuria with weight loss", "Dysuria with purulent urethral discharge"],
    a: 0,
    r: "BPH causes lower urinary tract symptoms (LUTS) due to prostatic enlargement compressing the urethra. Obstructive symptoms include hesitancy, weak stream, straining, and incomplete emptying. Irritative symptoms include frequency, urgency, and nocturia. Severe flank pain suggests renal calculi. Painless hematuria with weight loss suggests bladder cancer. Dysuria with discharge suggests urethritis.",
    s: "Renal"
  },
  {
    q: "A client with rhabdomyolysis has a creatine kinase (CK) level of 45,000 U/L and dark brown urine. Which intervention is the priority to prevent acute kidney injury?",
    o: ["Aggressive IV normal saline infusion to maintain urine output of at least 200-300 mL/hour", "Restrict fluids to prevent fluid overload", "Administer loop diuretics to increase urine output", "Begin renal-dose dopamine infusion"],
    a: 0,
    r: "Rhabdomyolysis releases myoglobin from damaged muscle, which is nephrotoxic and can cause AKI through tubular obstruction and oxidative injury. Aggressive IV fluid resuscitation with normal saline (targeting urine output of 200-300 mL/hour) is the primary intervention to dilute myoglobin and maintain renal perfusion. Fluid restriction worsens kidney damage. Diuretics without adequate volume can worsen injury. Renal-dose dopamine is not evidence-based.",
    s: "Renal"
  },
  {
    q: "A client is being treated for a urinary tract infection with trimethoprim-sulfamethoxazole (Bactrim). Which instruction should the nurse include in client education?",
    o: ["Drink plenty of fluids and avoid prolonged sun exposure as the medication causes photosensitivity", "Take the medication with dairy products to improve absorption", "Stop taking the medication as soon as symptoms resolve", "This medication is safe to take during the third trimester of pregnancy"],
    a: 0,
    r: "TMP-SMX can cause photosensitivity reactions, so clients should avoid prolonged sun exposure and use sunscreen. Adequate fluid intake (2-3 L/day) helps flush bacteria from the urinary tract. The full course must be completed even if symptoms improve to prevent antibiotic resistance. TMP-SMX is contraindicated in the third trimester due to risk of kernicterus. Dairy does not improve absorption.",
    s: "Renal"
  },
  {
    q: "A nurse is preparing a client for a renal biopsy. Which preprocedure assessment finding would require the nurse to notify the provider before proceeding?",
    o: ["Platelet count of 68,000/mm3", "BUN of 24 mg/dL", "Hemoglobin of 11.8 g/dL", "Blood pressure of 128/78 mmHg"],
    a: 0,
    r: "A platelet count below 100,000/mm3 is a relative contraindication for renal biopsy due to increased bleeding risk. The kidney is a highly vascular organ, and bleeding is the most common complication of renal biopsy. A count of 68,000 is significantly below the safe threshold. The other values are within acceptable ranges for the procedure.",
    s: "Renal"
  },
  {
    q: "A client with chronic kidney disease stage 5 has a hemoglobin of 8.2 g/dL and reports fatigue. The provider prescribes erythropoietin-stimulating agent (epoetin alfa). What is the target hemoglobin range for this client?",
    o: ["10-11.5 g/dL", "12-14 g/dL", "14-16 g/dL", "8-9 g/dL"],
    a: 0,
    r: "For CKD patients on erythropoietin-stimulating agents, the target hemoglobin is 10-11.5 g/dL. Targeting higher levels (greater than 13 g/dL) has been associated with increased cardiovascular events, stroke, and mortality in clinical trials (CHOIR, CREATE, TREAT). The lowest effective dose should be used to avoid blood transfusion need while minimizing cardiovascular risk.",
    s: "Renal"
  },
  {
    q: "A client develops tumor lysis syndrome after chemotherapy initiation for lymphoma. Which electrolyte abnormalities should the nurse anticipate?",
    o: ["Hyperkalemia, hyperphosphatemia, hyperuricemia, and hypocalcemia", "Hypokalemia, hypophosphatemia, and hypercalcemia", "Hypernatremia, hyperchloremia, and metabolic acidosis", "Hyponatremia, hypermagnesemia, and respiratory alkalosis"],
    a: 0,
    r: "Tumor lysis syndrome results from rapid release of intracellular contents after massive cell death. This causes hyperkalemia (from intracellular potassium release), hyperphosphatemia (from nucleic acid breakdown), hyperuricemia (from purine catabolism), and secondary hypocalcemia (phosphate binds calcium). These abnormalities can lead to cardiac arrhythmias, seizures, and acute kidney injury.",
    s: "Renal"
  },
  {
    q: "A nurse is caring for a client undergoing hemodialysis who develops hypotension, nausea, and muscle cramps 2 hours into the treatment. What should the nurse do first?",
    o: ["Slow the blood flow rate and administer a normal saline bolus", "Stop dialysis immediately and call the code team", "Increase the ultrafiltration rate to remove more fluid", "Administer IV potassium chloride"],
    a: 0,
    r: "Intradialytic hypotension is the most common complication of hemodialysis, caused by rapid fluid removal. The nurse should slow the blood pump speed, reduce the ultrafiltration rate, administer a normal saline bolus (100-200 mL), and place the client in Trendelenburg position. Stopping dialysis completely is premature. Increasing ultrafiltration worsens hypotension. Potassium is not indicated.",
    s: "Renal"
  },
  {
    q: "A client with polycystic kidney disease (PKD) asks about the inheritance pattern of the disease. The nurse explains that autosomal dominant PKD:",
    o: ["Requires only one parent to carry the gene, giving each child a 50% chance of inheriting the condition", "Requires both parents to carry the gene for a child to be affected", "Only affects male children because it is X-linked", "Is not inherited and occurs randomly due to spontaneous mutations"],
    a: 0,
    r: "Autosomal dominant polycystic kidney disease (ADPKD) is the most common inherited kidney disorder. Each child of an affected parent has a 50% chance of inheriting the mutation. It typically presents in the 3rd to 4th decade of life with bilateral renal cysts, hypertension, and progressive kidney failure. Autosomal recessive PKD requires both parents to carry the gene.",
    s: "Renal"
  },
  {
    q: "A client with a suprapubic catheter reports urine leaking around the catheter insertion site. What should the nurse assess first?",
    o: ["Check the catheter for kinking or obstruction that could cause back-pressure and leakage", "Remove the catheter and insert a new one immediately", "Apply a tighter dressing around the catheter site", "Instruct the client to decrease fluid intake"],
    a: 0,
    r: "Leakage around a suprapubic catheter is most commonly caused by catheter obstruction (kinking, clot, sediment) creating back-pressure that forces urine around the tube. The nurse should first assess for patency, check for kinks, and irrigate if ordered. Replacing the catheter is premature without assessment. Tighter dressing does not address the cause. Fluid restriction is not appropriate.",
    s: "Renal"
  },
  {
    q: "A nurse is caring for a client with acute glomerulonephritis 2 weeks after a streptococcal throat infection. Which assessment findings should the nurse expect?",
    o: ["Periorbital edema, dark smoky-colored urine, hypertension, and oliguria", "Polyuria, dehydration, and weight loss", "Bright red painless hematuria with urinary frequency", "Flank pain with colicky cramping radiating to the groin"],
    a: 0,
    r: "Acute post-streptococcal glomerulonephritis typically presents 1-3 weeks after streptococcal infection with periorbital and peripheral edema (especially in the morning), smoky brown or cola-colored urine (from RBCs in urine), hypertension (from fluid retention), and oliguria. Elevated ASO titers confirm recent streptococcal infection. Polyuria suggests DI. Bright red hematuria suggests bladder pathology. Flank pain with radiation suggests calculi.",
    s: "Renal"
  },
  {
    q: "A client is prescribed continuous bladder irrigation (CBI) after a transurethral resection of the prostate (TURP). The nurse notes the drainage is dark red with clots. What should the nurse do?",
    o: ["Increase the irrigation flow rate to clear the clots and prevent catheter obstruction", "Stop the irrigation and notify the surgeon immediately", "Decrease the flow rate to reduce the amount of drainage", "Clamp the catheter for 30 minutes to allow clotting"],
    a: 0,
    r: "After TURP, some bleeding with clots is expected. The purpose of CBI is to continuously flush the bladder to prevent clot formation and catheter obstruction. If the drainage is dark red with clots, the irrigation rate should be increased to improve flushing. The output should be light pink to clear. Stopping irrigation allows clot accumulation. Clamping causes bladder distension and is contraindicated post-TURP.",
    s: "Renal"
  },
  // ===== ENDOCRINE (Questions 101-120) =====
  {
    q: "A client with type 1 diabetes presents with blood glucose of 520 mg/dL, pH 7.18, serum bicarbonate 10 mEq/L, and fruity breath odor. Which intervention is the priority after establishing IV access?",
    o: ["Begin continuous IV regular insulin infusion as ordered", "Administer subcutaneous NPH insulin 30 units", "Administer IV sodium bicarbonate to correct the acidosis", "Give the client orange juice and crackers"],
    a: 0,
    r: "Diabetic ketoacidosis (DKA) requires continuous IV regular insulin infusion to gradually reduce blood glucose and halt ketone production. Subcutaneous insulin has unpredictable absorption in dehydrated clients. Sodium bicarbonate is only given for severe acidosis (pH less than 6.9) as insulin corrects the underlying cause. Orange juice would worsen hyperglycemia.",
    s: "Endocrine"
  },
  {
    q: "A client with type 2 diabetes is started on metformin 500 mg twice daily. Which side effect should the nurse educate the client about?",
    o: ["Gastrointestinal symptoms including nausea, diarrhea, and abdominal discomfort, especially during the first few weeks", "Significant weight gain due to insulin stimulation", "Frequent hypoglycemic episodes requiring glucose tablets", "Elevated liver enzymes requiring monthly liver function tests"],
    a: 0,
    r: "Metformin commonly causes GI side effects (nausea, diarrhea, abdominal cramping, metallic taste) that typically improve over weeks. Taking with food and using extended-release formulation can help. Metformin does not cause weight gain; it is weight-neutral or promotes modest weight loss. When used alone, metformin rarely causes hypoglycemia. The rare serious concern is lactic acidosis, not hepatotoxicity.",
    s: "Endocrine"
  },
  {
    q: "A client post-thyroidectomy is exhibiting tingling around the mouth and fingertips, muscle twitching, and a positive Chvostek sign. What does the nurse suspect, and what treatment should be anticipated?",
    o: ["Hypocalcemia from inadvertent removal of the parathyroid glands; IV calcium gluconate", "Thyroid storm from manipulation of the thyroid gland; IV propranolol", "Laryngeal nerve damage; emergency tracheotomy", "Hemorrhage at the surgical site; return to the operating room"],
    a: 0,
    r: "Tingling (circumoral and fingertips), muscle twitching, and positive Chvostek sign (facial muscle twitching when facial nerve is tapped) indicate hypocalcemia, which occurs when parathyroid glands are damaged or inadvertently removed during thyroidectomy. Treatment is IV calcium gluconate for acute symptoms and oral calcium with vitamin D supplementation. Trousseau sign (carpal spasm with BP cuff) is another indicator.",
    s: "Endocrine"
  },
  {
    q: "A client with Cushing syndrome presents with moon face, central obesity, purple striae, and thin extremities. Which laboratory finding is consistent with this condition?",
    o: ["Elevated serum cortisol with hyperglycemia and hypokalemia", "Decreased serum cortisol with hypoglycemia", "Elevated TSH with decreased T4", "Decreased ACTH with elevated aldosterone"],
    a: 0,
    r: "Cushing syndrome results from chronic excess cortisol. Cortisol increases gluconeogenesis (causing hyperglycemia), promotes sodium and water retention with potassium excretion (causing hypokalemia and hypertension), causes protein catabolism (thin extremities, striae, poor wound healing), and fat redistribution (moon face, buffalo hump, central obesity). Decreased cortisol is Addison disease.",
    s: "Endocrine"
  },
  {
    q: "A client with Addison disease is admitted with nausea, vomiting, hypotension, and confusion. Serum sodium is 128 mEq/L and potassium is 6.2 mEq/L. What is this life-threatening condition called?",
    o: ["Addisonian crisis (acute adrenal insufficiency)", "Myxedema coma", "Thyroid storm", "Pheochromocytoma crisis"],
    a: 0,
    r: "Addisonian crisis is an acute, life-threatening exacerbation of adrenal insufficiency triggered by stress, infection, or abrupt withdrawal of exogenous steroids. It presents with severe hypotension, shock, hyperkalemia, hyponatremia, hypoglycemia, and altered consciousness. Treatment is emergent IV hydrocortisone, fluid resuscitation with normal saline, and glucose correction.",
    s: "Endocrine"
  },
  {
    q: "A nurse is caring for a client with diabetes insipidus. Which assessment findings should the nurse expect?",
    o: ["Excessive urine output (5-20 L/day), extreme thirst, and low urine specific gravity", "Decreased urine output, peripheral edema, and low serum osmolality", "Normal urine output with glucosuria and ketonuria", "Oliguria with high urine specific gravity and dark concentrated urine"],
    a: 0,
    r: "Diabetes insipidus results from insufficient ADH secretion (central DI) or renal unresponsiveness to ADH (nephrogenic DI). Without ADH, the kidneys cannot concentrate urine, resulting in massive polyuria (5-20 L/day), polydipsia, dilute urine (specific gravity less than 1.005), high serum osmolality, and hypernatremia. SIADH causes the opposite: oliguria, concentrated urine, and hyponatremia.",
    s: "Endocrine"
  },
  {
    q: "A client with hyperthyroidism (Graves disease) is being prepared for a thyroidectomy. Which medication should the nurse administer preoperatively to reduce thyroid vascularity?",
    o: ["Potassium iodide (Lugol solution)", "Levothyroxine (Synthroid)", "Prednisone", "Metformin"],
    a: 0,
    r: "Potassium iodide (Lugol solution or saturated solution of potassium iodide) is given 10-14 days before thyroidectomy to decrease the vascularity and size of the thyroid gland, reducing intraoperative bleeding risk. It also inhibits thyroid hormone release. Levothyroxine is for hypothyroidism. Prednisone may be given for thyroid storm but does not reduce vascularity. Metformin is for diabetes.",
    s: "Endocrine"
  },
  {
    q: "A client with type 2 diabetes taking glipizide reports episodes of diaphoresis, tremors, and confusion in the late afternoon. Blood glucose at the time of symptoms is 52 mg/dL. What should the nurse educate the client about?",
    o: ["Eat regular meals and snacks and carry a fast-acting carbohydrate source at all times", "Switch to insulin therapy to prevent these episodes", "Skip meals to reduce overall caloric intake", "Exercise vigorously in the afternoon to use up excess glucose"],
    a: 0,
    r: "Glipizide is a sulfonylurea that stimulates pancreatic insulin secretion, which can cause hypoglycemia especially if meals are delayed or skipped. Clients should eat regular meals and snacks, carry glucose tablets or juice, and recognize early signs of hypoglycemia. Skipping meals increases hypoglycemia risk. Vigorous exercise without eating also increases risk. The medication may need dose adjustment rather than switching to insulin.",
    s: "Endocrine"
  },
  {
    q: "A nurse is monitoring a client with syndrome of inappropriate antidiuretic hormone (SIADH). Which intervention is most appropriate?",
    o: ["Restrict fluids to 500-1,000 mL per day as ordered", "Encourage fluid intake of at least 3 liters per day", "Administer desmopressin (DDAVP) intranasally", "Start IV D5W at 200 mL/hour"],
    a: 0,
    r: "SIADH causes excessive water retention and dilutional hyponatremia. The primary intervention is fluid restriction (typically 500-1,000 mL/day) to allow serum sodium to normalize. Encouraging fluids would worsen hyponatremia. DDAVP is synthetic ADH used to treat diabetes insipidus, the opposite condition. D5W is hypotonic and would further dilute serum sodium.",
    s: "Endocrine"
  },
  {
    q: "A client with diabetic ketoacidosis is being treated with continuous IV insulin infusion. The blood glucose has dropped from 480 mg/dL to 250 mg/dL over 3 hours. What should the nurse anticipate?",
    o: ["Add dextrose to the IV fluids and continue insulin to close the anion gap", "Discontinue the insulin infusion since the glucose is approaching normal", "Switch to subcutaneous insulin immediately", "Reduce IV fluids to prevent cerebral edema"],
    a: 0,
    r: "In DKA, the insulin infusion must continue even after blood glucose decreases to resolve the ketoacidosis (close the anion gap). When glucose reaches 200-250 mg/dL, D5 or D10 is added to IV fluids to prevent hypoglycemia while continuing insulin to clear ketones. Stopping insulin prematurely allows ketone production to resume. Subcutaneous transition occurs only after the anion gap closes and the client is eating.",
    s: "Endocrine"
  },
  {
    q: "A nurse is educating a client newly diagnosed with hypothyroidism about levothyroxine therapy. Which instruction is most important?",
    o: ["Take the medication on an empty stomach, 30-60 minutes before breakfast, with a full glass of water", "Take the medication with food to reduce stomach upset", "Take the medication at bedtime with a glass of milk", "Take the medication only when feeling symptoms of fatigue"],
    a: 0,
    r: "Levothyroxine absorption is significantly reduced by food, calcium, iron, and antacids. It should be taken on an empty stomach 30-60 minutes before breakfast (or 3-4 hours after the last meal if taken at bedtime) with water only. The medication must be taken daily regardless of symptoms, as it is a hormone replacement that maintains steady-state thyroid levels. Milk contains calcium that interferes with absorption.",
    s: "Endocrine"
  },
  {
    q: "A client with pheochromocytoma is scheduled for adrenalectomy. The nurse understands that the client is at highest risk for which intraoperative complication?",
    o: ["Severe hypertensive crisis and cardiac arrhythmias during tumor manipulation", "Hypothermia from prolonged anesthesia", "Air embolism from vascular access", "Malignant hyperthermia from anesthetic agents"],
    a: 0,
    r: "Pheochromocytoma is a catecholamine-secreting tumor of the adrenal medulla. During surgical manipulation, massive release of catecholamines (epinephrine, norepinephrine) can cause severe hypertensive crisis, cardiac arrhythmias, and cardiovascular collapse. Preoperative alpha-blockade (phenoxybenzamine) followed by beta-blockade is essential to prevent this complication.",
    s: "Endocrine"
  },
  {
    q: "A client with type 1 diabetes is preparing to exercise. The pre-exercise blood glucose is 280 mg/dL and urine ketones are positive. What should the nurse advise?",
    o: ["Do not exercise; administer insulin as prescribed and recheck blood glucose and ketones", "Proceed with exercise as it will lower the blood glucose naturally", "Eat a complex carbohydrate snack and then begin exercising", "Drink extra water and exercise at a reduced intensity"],
    a: 0,
    r: "Exercise is contraindicated when blood glucose is above 250-300 mg/dL with ketones present. In this state, insulin deficiency has caused hyperglycemia and ketone production. Exercise would further increase counter-regulatory hormones, worsening hyperglycemia and ketosis. Insulin must be administered to lower glucose and halt ketone production before exercise can safely resume.",
    s: "Endocrine"
  },
  {
    q: "A nurse is assessing a client with suspected hyperaldosteronism (Conn syndrome). Which combination of findings would the nurse expect?",
    o: ["Hypertension, hypokalemia, and metabolic alkalosis", "Hypotension, hyperkalemia, and metabolic acidosis", "Hypertension, hypercalcemia, and hypernatremia", "Hypotension, hyponatremia, and hypoglycemia"],
    a: 0,
    r: "Hyperaldosteronism causes excessive aldosterone secretion, which promotes sodium and water retention (causing hypertension) and potassium excretion (causing hypokalemia). Potassium loss leads to metabolic alkalosis as hydrogen ions shift intracellularly to replace potassium. Hypotension with hyperkalemia and acidosis suggests Addison disease. The other combinations do not match aldosterone excess.",
    s: "Endocrine"
  },
  {
    q: "A client with myxedema coma is admitted to the ICU. Which interventions should the nurse anticipate? Select the most critical first action.",
    o: ["Administer IV levothyroxine and IV hydrocortisone as ordered", "Apply active external rewarming with heating blankets", "Administer IV dextrose bolus and start dextrose infusion", "Perform rapid sequence intubation for airway protection"],
    a: 0,
    r: "Myxedema coma is a life-threatening emergency of severe hypothyroidism. The priority treatment is IV levothyroxine to replace thyroid hormone, given with IV hydrocortisone (corticosteroids must be given before or with thyroid hormone to prevent adrenal crisis, as hypothyroidism may mask coexisting adrenal insufficiency). Active rewarming is avoided as it can cause vasodilation and circulatory collapse; passive rewarming is preferred.",
    s: "Endocrine"
  },
  {
    q: "A nurse is caring for a client with acromegaly. Which assessment finding is most consistent with this condition?",
    o: ["Enlargement of the hands, feet, and jaw with coarsened facial features", "Short stature with delayed puberty", "Excessive weight loss with exophthalmos", "Generalized hair loss with cold intolerance"],
    a: 0,
    r: "Acromegaly is caused by excess growth hormone in adults (after epiphyseal plate closure), causing enlargement of bones in the hands, feet, and jaw, along with coarsened facial features, soft tissue swelling, and organ enlargement. Short stature suggests GH deficiency. Weight loss with exophthalmos suggests hyperthyroidism. Hair loss with cold intolerance suggests hypothyroidism.",
    s: "Endocrine"
  },
  {
    q: "A client with type 2 diabetes has an HbA1c of 9.2%. The nurse understands this result indicates:",
    o: ["The client's average blood glucose over the past 2-3 months has been poorly controlled", "The client's blood glucose was high only on the day of testing", "The client has excellent glycemic control", "The client needs to have the test repeated because the result is unreliable"],
    a: 0,
    r: "HbA1c reflects the average blood glucose over 2-3 months by measuring the percentage of hemoglobin that is glycosylated. An HbA1c of 9.2% corresponds to an estimated average glucose of approximately 217 mg/dL. The ADA target for most adults with diabetes is less than 7%. A result of 9.2% indicates chronically poor glucose control requiring medication adjustment, dietary modification, and education.",
    s: "Endocrine"
  },
  {
    q: "A client is admitted with thyroid storm. Which assessment findings would the nurse expect?",
    o: ["Temperature 40.5 C, heart rate 160, severe agitation, and profuse diaphoresis", "Temperature 34.2 C, heart rate 48, lethargy, and dry skin", "Blood pressure 220/130, headache, and papilledema", "Temperature 37.0 C, heart rate 72, and normal mental status"],
    a: 0,
    r: "Thyroid storm (thyrotoxic crisis) presents with extreme manifestations of hyperthyroidism: high fever (greater than 40 C), severe tachycardia (often above 140), agitation or delirium, profuse diaphoresis, tremors, and potential cardiovascular collapse. Treatment includes beta-blockers (propranolol), antithyroid drugs (PTU or methimazole), iodine solution, corticosteroids, and supportive care. Hypothermia and bradycardia suggest myxedema.",
    s: "Endocrine"
  },
  {
    q: "A client with Graves disease asks about radioactive iodine (RAI) therapy. Which statement should the nurse include in education?",
    o: ["After treatment, you will likely need to take thyroid replacement medication for the rest of your life", "The radioactive iodine will cure the disease without any long-term medication needs", "You will need to be hospitalized in isolation for 2 weeks after the treatment", "Radioactive iodine therapy is only used for thyroid cancer, not Graves disease"],
    a: 0,
    r: "RAI therapy destroys overactive thyroid cells, effectively treating hyperthyroidism. However, most clients (80-90%) develop hypothyroidism within the first year and require lifelong levothyroxine replacement. This is an expected outcome, not a complication. RAI is given as an outpatient with radiation safety precautions for a few days. RAI is used for both Graves disease and thyroid cancer (at different doses).",
    s: "Endocrine"
  },
  {
    q: "A nurse is managing insulin therapy for a hospitalized client. The client is receiving glargine (Lantus) 20 units at bedtime and lispro (Humalog) before meals. The client's blood glucose at 3:00 AM is 58 mg/dL and fasting glucose at 7:00 AM is 224 mg/dL. What phenomenon does this pattern suggest?",
    o: ["Somogyi effect: nocturnal hypoglycemia triggering rebound morning hyperglycemia", "Dawn phenomenon: early morning surge of growth hormone and cortisol", "Insulin resistance requiring higher doses", "Laboratory error requiring repeat testing"],
    a: 0,
    r: "The Somogyi effect occurs when nighttime hypoglycemia triggers a counter-regulatory hormone response (glucagon, cortisol, epinephrine, growth hormone), causing rebound hyperglycemia by morning. The 3 AM glucose of 58 (hypoglycemia) followed by morning glucose of 224 (hyperglycemia) is classic. Treatment involves reducing the evening insulin dose. The dawn phenomenon shows rising glucose without preceding hypoglycemia.",
    s: "Endocrine"
  },
  // ===== HEMATOLOGY/ONCOLOGY (Questions 121-140) =====
  {
    q: "A client receiving chemotherapy has a nadir absolute neutrophil count (ANC) of 320/mm3. What is the priority nursing intervention?",
    o: ["Implement neutropenic precautions including protective isolation and strict hand hygiene", "Encourage the client to have visitors to improve emotional well-being", "Administer live vaccines to boost immune function", "Increase the client's physical activity to stimulate bone marrow production"],
    a: 0,
    r: "An ANC below 500/mm3 indicates severe neutropenia with high risk for life-threatening infection. Neutropenic precautions include private room, strict hand hygiene, avoiding fresh flowers and raw foods, wearing masks, monitoring temperature every 4 hours, and avoiding invasive procedures. Visitors may introduce pathogens. Live vaccines are absolutely contraindicated. Exercise does not stimulate neutrophil production.",
    s: "Hematology"
  },
  {
    q: "A client with sickle cell disease is admitted in vaso-occlusive crisis. Which interventions should the nurse prioritize?",
    o: ["Aggressive IV hydration, pain management with opioid analgesics, and supplemental oxygen", "Restrict fluids to prevent pulmonary edema and administer aspirin", "Apply ice packs to the affected areas and encourage deep breathing", "Withhold opioids to prevent addiction and administer acetaminophen only"],
    a: 0,
    r: "Vaso-occlusive crisis management priorities include aggressive IV hydration (to reduce blood viscosity and prevent further sickling), adequate pain management (typically IV opioids as pain is severe), supplemental oxygen (to prevent further deoxygenation and sickling), and monitoring for complications. Fluid restriction worsens sickling. Ice increases vasoconstriction. Withholding opioids for sickle cell pain is inappropriate and harmful.",
    s: "Hematology",
    image: imgACSExam
  },
  {
    q: "A client is receiving a blood transfusion of packed red blood cells. Twenty minutes into the transfusion, the client develops fever, chills, flank pain, and dark urine. What should the nurse do first?",
    o: ["Stop the transfusion immediately and keep the IV line open with normal saline", "Slow the transfusion rate and administer diphenhydramine", "Continue the transfusion and administer acetaminophen", "Increase the transfusion rate to complete it more quickly"],
    a: 0,
    r: "Fever, chills, flank pain, and dark urine (hemoglobinuria) indicate an acute hemolytic transfusion reaction, a life-threatening emergency caused by ABO incompatibility. The nurse must immediately stop the transfusion, keep the IV open with normal saline (new tubing), notify the provider and blood bank, send the remaining blood and a new client blood sample for testing, and monitor for DIC and renal failure.",
    s: "Hematology"
  },
  {
    q: "A client with acute lymphoblastic leukemia (ALL) is undergoing induction chemotherapy. The nurse notes petechiae, ecchymosis, and oozing from the IV site. Platelet count is 12,000/mm3. What should the nurse anticipate?",
    o: ["Platelet transfusion and bleeding precautions", "Fresh frozen plasma infusion", "Administration of vitamin K", "Cryoprecipitate transfusion"],
    a: 0,
    r: "A platelet count of 12,000/mm3 (critically low, normal 150,000-400,000) with active bleeding signs requires platelet transfusion and implementation of bleeding precautions (soft toothbrush, electric razor, fall prevention, avoiding IM injections and rectal temperatures). FFP replaces clotting factors, not platelets. Vitamin K corrects coagulopathy from warfarin or liver disease. Cryoprecipitate provides fibrinogen and Factor VIII.",
    s: "Hematology"
  },
  {
    q: "A nurse is caring for a client with disseminated intravascular coagulation (DIC). Which combination of laboratory findings is diagnostic?",
    o: ["Prolonged PT and aPTT, elevated D-dimer, decreased fibrinogen, decreased platelets", "Shortened PT and aPTT with elevated fibrinogen", "Normal PT and aPTT with elevated platelet count", "Elevated fibrinogen with normal D-dimer"],
    a: 0,
    r: "DIC involves simultaneous widespread clotting and hemorrhage. Clotting factors and platelets are consumed in microvascular thrombi (prolonged PT/aPTT, decreased fibrinogen, thrombocytopenia), while fibrinolysis produces fibrin degradation products (elevated D-dimer and FDPs). The paradox of DIC is bleeding from consumption of clotting factors during excessive clotting.",
    s: "Hematology"
  },
  {
    q: "A client with iron deficiency anemia is prescribed oral ferrous sulfate 325 mg three times daily. Which instruction should the nurse provide for optimal absorption?",
    o: ["Take with vitamin C (orange juice) on an empty stomach and avoid taking with dairy, antacids, or tea", "Take with meals and a glass of milk to reduce stomach irritation", "Take at bedtime with a calcium supplement", "Take only when feeling symptoms of anemia"],
    a: 0,
    r: "Iron absorption is enhanced by vitamin C (ascorbic acid) and acidic environments. It should be taken on an empty stomach for best absorption, though it can be taken with food if GI side effects are intolerable (at the cost of reduced absorption). Calcium, dairy, antacids, tea, coffee, and fiber reduce iron absorption. Iron should be taken consistently, not only when symptomatic.",
    s: "Hematology"
  },
  {
    q: "A client receiving cisplatin chemotherapy is at risk for which dose-limiting toxicity that requires close monitoring?",
    o: ["Nephrotoxicity requiring aggressive pre- and post-hydration", "Cardiotoxicity requiring baseline and serial echocardiograms", "Pulmonary fibrosis requiring serial pulmonary function tests", "Hepatic veno-occlusive disease requiring liver function monitoring"],
    a: 0,
    r: "Cisplatin is a platinum-based chemotherapy agent with dose-limiting nephrotoxicity. Aggressive IV hydration before and after administration is essential to prevent renal tubular damage. BUN, creatinine, and electrolytes (especially magnesium) must be monitored closely. Cardiotoxicity is associated with doxorubicin. Pulmonary fibrosis is associated with bleomycin. Veno-occlusive disease is associated with bone marrow transplant conditioning regimens.",
    s: "Hematology"
  },
  {
    q: "A client with hemophilia A (factor VIII deficiency) falls and sustains a knee injury. The knee is swollen and painful. What is the priority treatment?",
    o: ["Administer factor VIII concentrate as ordered and apply ice to the joint", "Apply heat to the affected knee and begin range-of-motion exercises", "Administer aspirin for pain and inflammation", "Apply a pressure bandage and begin weight-bearing activities"],
    a: 0,
    r: "Hemarthrosis (bleeding into a joint) is a common complication of hemophilia A. The priority is replacing the missing factor VIII to stop the bleeding, followed by rest, ice, compression, and elevation (RICE) of the affected joint. Heat increases blood flow and bleeding. Aspirin inhibits platelet function and is contraindicated. Weight-bearing on an acutely bleeding joint causes further damage.",
    s: "Hematology"
  },
  {
    q: "A client with Hodgkin lymphoma asks about the staging of the disease. The oncologist has staged it as IIB. What does the 'B' designation indicate?",
    o: ["The presence of B symptoms: unexplained fever, drenching night sweats, or weight loss greater than 10% in 6 months", "The tumor involves two body systems", "The disease has spread to the bone marrow", "The client has a secondary malignancy"],
    a: 0,
    r: "In the Ann Arbor staging system for lymphoma, 'B' indicates the presence of systemic (constitutional) B symptoms: unexplained fever greater than 38 C, drenching night sweats, or unintentional weight loss greater than 10% of body weight in 6 months. 'A' designation indicates absence of these symptoms. B symptoms generally indicate a worse prognosis. Stage II means involvement of two or more lymph node regions on the same side of the diaphragm.",
    s: "Hematology"
  },
  {
    q: "A nurse is administering doxorubicin (Adriamycin) to a client. The client reports burning and pain at the IV site. The nurse observes swelling around the insertion site and no blood return. What should the nurse do first?",
    o: ["Stop the infusion immediately as extravasation of a vesicant is suspected", "Slow the infusion rate and apply a warm compress", "Continue the infusion and assess again in 15 minutes", "Flush the IV with normal saline to verify patency"],
    a: 0,
    r: "Doxorubicin is a vesicant chemotherapy agent that causes severe tissue necrosis if it extravasates. Signs of extravasation include pain, burning, swelling at the IV site, and lack of blood return. The infusion must be stopped immediately. Attempts to aspirate residual drug should be made, and the specific antidote (dexrazoxane) should be administered per protocol. Never flush a suspected extravasation as it spreads the vesicant.",
    s: "Hematology"
  },
  {
    q: "A client with chronic myelogenous leukemia (CML) is prescribed imatinib (Gleevec). The nurse should educate the client that this medication works by:",
    o: ["Blocking the BCR-ABL tyrosine kinase protein produced by the Philadelphia chromosome", "Stimulating the immune system to attack leukemia cells", "Destroying rapidly dividing cells through DNA cross-linking", "Preventing blood vessel formation that feeds the tumor"],
    a: 0,
    r: "Imatinib is a targeted therapy that specifically inhibits the BCR-ABL tyrosine kinase, an abnormal protein produced by the Philadelphia chromosome translocation (t(9;22)) characteristic of CML. This targeted approach has transformed CML into a manageable chronic disease. It is not an immunotherapy, traditional cytotoxic agent, or anti-angiogenic drug.",
    s: "Hematology"
  },
  {
    q: "A nurse is caring for a client receiving heparin therapy who develops heparin-induced thrombocytopenia (HIT). Which action is most important?",
    o: ["Discontinue all heparin products immediately and start an alternative anticoagulant", "Decrease the heparin dose by 50%", "Administer platelet transfusion to correct the thrombocytopenia", "Continue heparin and monitor platelet counts daily"],
    a: 0,
    r: "HIT is an immune-mediated reaction causing platelet activation, thrombocytopenia, and paradoxical thrombosis. All heparin products (including flushes) must be discontinued immediately, and a non-heparin anticoagulant (argatroban, bivalirudin) must be started to prevent life-threatening thrombotic complications. Platelet transfusions can worsen thrombosis. Reducing or continuing heparin perpetuates the immune reaction.",
    s: "Hematology"
  },
  {
    q: "A client with pernicious anemia is prescribed cyanocobalamin (vitamin B12) injections. The nurse should educate the client that:",
    o: ["The injections will be needed for the rest of your life because your body cannot absorb oral vitamin B12", "You can switch to oral supplements once your levels normalize", "The injections are only needed for 6 months and then can be discontinued", "A high-protein diet will provide enough B12 to replace the injections"],
    a: 0,
    r: "Pernicious anemia is caused by lack of intrinsic factor (produced by gastric parietal cells), which is essential for vitamin B12 absorption in the terminal ileum. Without intrinsic factor, oral B12 cannot be absorbed regardless of dietary intake. Therefore, lifelong parenteral (IM or subcutaneous) B12 replacement is necessary. Some evidence supports high-dose oral B12 as passive absorption occurs at about 1%, but this is not standard practice.",
    s: "Hematology"
  },
  {
    q: "A client undergoing chemotherapy has an absolute neutrophil count (ANC) of 800/mm3 and develops a temperature of 38.5 C. What is the priority nursing action?",
    o: ["Obtain blood cultures and administer broad-spectrum antibiotics within 1 hour as ordered", "Administer acetaminophen and recheck the temperature in 4 hours", "Apply a cooling blanket and increase IV fluid rate", "Wait for the ANC to recover before treating the fever"],
    a: 0,
    r: "Febrile neutropenia (ANC less than 1,000 with temperature 38.3 C or higher) is a medical emergency. Blood cultures (at least 2 sets from different sites) must be obtained and empiric broad-spectrum antibiotics (typically an anti-pseudomonal beta-lactam) started within 60 minutes of fever onset. Delayed antibiotics significantly increase mortality. Waiting for culture results or ANC recovery before treating is dangerous.",
    s: "Hematology"
  },
  {
    q: "A client with newly diagnosed multiple myeloma reports severe back pain and fatigue. Laboratory results show calcium 13.2 mg/dL, creatinine 2.8 mg/dL, and total protein 11.4 g/dL. Which complication requires the most immediate attention?",
    o: ["Hypercalcemia requiring aggressive IV hydration and bisphosphonate therapy", "Renal insufficiency requiring immediate dialysis", "Hyperviscosity syndrome requiring plasmapheresis", "Pathological fracture requiring surgical fixation"],
    a: 0,
    r: "Hypercalcemia of 13.2 mg/dL is a medical emergency in multiple myeloma (caused by osteoclast activation and bone destruction). Immediate treatment includes aggressive IV normal saline for volume expansion and calciuresis, followed by IV bisphosphonate (zoledronic acid) to inhibit osteoclast activity. Severe hypercalcemia can cause cardiac arrhythmias, coma, and death. While all complications need attention, acute hypercalcemia is most immediately life-threatening.",
    s: "Hematology"
  },
  {
    q: "A nurse is caring for a client with thrombotic thrombocytopenic purpura (TTP). Which combination of findings is characteristic of this condition?",
    o: ["Thrombocytopenia, microangiopathic hemolytic anemia, neurological symptoms, fever, and renal dysfunction", "Isolated thrombocytopenia with normal hemoglobin and no organ involvement", "Elevated platelet count with deep vein thrombosis", "Prolonged PT and aPTT with elevated fibrinogen"],
    a: 0,
    r: "TTP classically presents with a pentad: thrombocytopenia, microangiopathic hemolytic anemia (schistocytes on peripheral smear), neurological symptoms (confusion, headache, seizures), fever, and renal dysfunction. The condition is caused by deficiency of ADAMTS13 enzyme, leading to ultra-large von Willebrand factor multimers that cause platelet aggregation. Treatment is urgent plasma exchange (plasmapheresis).",
    s: "Hematology"
  },
  {
    q: "A client with breast cancer completed chemotherapy and radiation 3 months ago. The client now reports persistent fatigue despite adequate sleep. What should the nurse advise?",
    o: ["Cancer-related fatigue can persist for months after treatment; regular moderate exercise is the most effective management strategy", "This level of fatigue is not expected after treatment and should be investigated for cancer recurrence immediately", "Take extended bed rest until the fatigue resolves completely", "Increase caffeine intake to combat the fatigue throughout the day"],
    a: 0,
    r: "Cancer-related fatigue (CRF) is the most common side effect of cancer treatment and can persist for months to years after treatment completion. Evidence-based management includes regular moderate exercise (most effective intervention), adequate nutrition, stress management, sleep hygiene, and addressing contributing factors (anemia, depression, hypothyroidism). Bed rest worsens fatigue. Caffeine can disrupt sleep patterns.",
    s: "Hematology"
  },
  {
    q: "A nurse is preparing to administer a unit of platelets to a client. Which statement about platelet transfusion is correct?",
    o: ["Platelets must be administered rapidly, typically over 15-30 minutes, and should never be refrigerated", "Platelets should be infused slowly over 4 hours, similar to packed red blood cells", "Platelets must be crossmatched in the same way as red blood cells", "Platelets should be stored in a refrigerator at 4 degrees Celsius until ready to use"],
    a: 0,
    r: "Platelets are stored at room temperature (20-24 C) on a continuous agitator and have a short shelf life (5 days). They should be administered rapidly, typically over 15-30 minutes. Refrigeration damages platelets and reduces their function. PRBCs are stored refrigerated and infused over 2-4 hours. ABO-compatible platelets are preferred but crossmatching is not required in the same way as RBCs.",
    s: "Hematology"
  },
  {
    q: "A client with polycythemia vera has a hematocrit of 62%. Which intervention should the nurse anticipate?",
    o: ["Therapeutic phlebotomy to reduce blood volume and viscosity", "Blood transfusion to correct the anemia", "IV fluid restriction to concentrate the blood further", "Erythropoietin injections to regulate red blood cell production"],
    a: 0,
    r: "Polycythemia vera is a myeloproliferative disorder with excessive red blood cell production, causing hyperviscosity and increased thrombosis risk. Therapeutic phlebotomy (removing 250-500 mL of blood) is the primary treatment to maintain hematocrit below 45% in men and 42% in women. Transfusion would worsen the condition. Fluid restriction increases viscosity. Erythropoietin would further increase RBC production.",
    s: "Hematology"
  },
  {
    q: "A client is receiving a granulocyte colony-stimulating factor (G-CSF, filgrastim) after chemotherapy. Which assessment finding indicates the medication is effective?",
    o: ["Rising absolute neutrophil count on serial CBCs", "Decreasing platelet count", "Increasing hemoglobin level", "Decreasing white blood cell differential"],
    a: 0,
    r: "Filgrastim (G-CSF) stimulates the bone marrow to produce and release neutrophils, the primary defense against bacterial infections. The therapeutic effect is demonstrated by a rising ANC. G-CSF does not directly affect platelet production (that is oprelvekin/IL-11) or hemoglobin (that is erythropoietin). A decreasing WBC differential would indicate the medication is not working.",
    s: "Hematology"
  },
  // ===== MENTAL HEALTH (Questions 141-155) =====
  {
    q: "A client admitted for suicidal ideation tells the nurse, 'I have a plan to end my life and I have the means at home.' Which action should the nurse take first?",
    o: ["Initiate one-to-one continuous observation and notify the treatment team immediately", "Ask the client to sign a no-harm contract", "Provide educational materials about coping strategies", "Schedule a family meeting to discuss the client's feelings"],
    a: 0,
    r: "A client with a specific plan and access to means is at imminent risk for suicide and requires the highest level of safety intervention. Continuous one-to-one observation ensures immediate protection while the treatment team is notified for comprehensive assessment and safety planning. No-harm contracts are not evidence-based for preventing suicide. Education and family meetings are important but not the immediate priority.",
    s: "Mental Health"
  },
  {
    q: "A nurse is caring for a client with major depressive disorder who is started on fluoxetine (Prozac). Which teaching point is most critical during the first 2-4 weeks of therapy?",
    o: ["Energy may increase before mood improves, potentially increasing the risk of acting on suicidal thoughts", "The medication will begin working within 24-48 hours", "The client should avoid all social interactions while adjusting to the medication", "Drowsiness is the most dangerous side effect of this medication"],
    a: 0,
    r: "SSRIs take 2-4 weeks to fully improve mood, but energy and motivation may increase sooner. This paradoxically increases suicide risk because a client who was too depressed to act on suicidal thoughts now has the energy to do so. Close monitoring during this period is essential, especially in adolescents and young adults. SSRIs do not work within 24-48 hours. Social isolation worsens depression.",
    s: "Mental Health"
  },
  {
    q: "A client with bipolar disorder is prescribed lithium carbonate. The client's serum lithium level is 2.2 mEq/L. Which symptoms would the nurse expect to observe?",
    o: ["Severe toxicity symptoms: confusion, seizures, oliguria, and cardiac arrhythmias", "Therapeutic response with stable mood", "Subtherapeutic levels requiring dose increase", "Mild side effects including fine hand tremor and increased thirst"],
    a: 0,
    r: "The therapeutic lithium level is 0.6-1.2 mEq/L. A level of 2.2 mEq/L indicates severe lithium toxicity. Symptoms progress from mild (1.5-2.0: coarse tremor, severe GI symptoms, confusion) to severe (2.0-2.5: seizures, arrhythmias, oliguria, circulatory failure) to potentially fatal (above 2.5). The lithium must be held, IV fluids administered, and the level monitored closely. Hemodialysis may be necessary.",
    s: "Mental Health"
  },
  {
    q: "A nurse is caring for a client experiencing alcohol withdrawal. Forty-eight hours after the last drink, the client develops visual hallucinations, tremors, diaphoresis, and a temperature of 39.2 C. What condition should the nurse recognize?",
    o: ["Delirium tremens (severe alcohol withdrawal)", "Alcohol intoxication", "Wernicke encephalopathy", "Alcohol-induced psychosis"],
    a: 0,
    r: "Delirium tremens typically occurs 48-72 hours after the last drink and is characterized by severe autonomic instability (tachycardia, hypertension, fever, diaphoresis), visual and tactile hallucinations, severe tremors, agitation, and confusion. It is a medical emergency with 5-15% mortality without treatment. Alcohol intoxication would not occur 48 hours after the last drink. Wernicke encephalopathy presents with ataxia, confusion, and ophthalmoplegia.",
    s: "Mental Health"
  },
  {
    q: "A client with schizophrenia has been taking haloperidol for 3 months. The client develops involuntary lip smacking, tongue protrusion, and facial grimacing. What adverse effect has occurred?",
    o: ["Tardive dyskinesia", "Acute dystonia", "Akathisia", "Neuroleptic malignant syndrome"],
    a: 0,
    r: "Tardive dyskinesia (TD) is a potentially irreversible extrapyramidal side effect of long-term antipsychotic use, characterized by involuntary rhythmic movements of the face, tongue, jaw, and extremities (lip smacking, tongue protrusion, facial grimacing, choreiform movements). Acute dystonia occurs early (hours to days) with sustained muscle contractions. Akathisia presents with restlessness. NMS presents with hyperthermia and rigidity.",
    s: "Mental Health"
  },
  {
    q: "A nurse is implementing therapeutic communication with a client who is expressing anger about a recent diagnosis. The client says, 'Nobody understands what I'm going through!' Which response is most therapeutic?",
    o: ["It sounds like you're feeling alone in dealing with this diagnosis. Tell me more about what you're experiencing.", "I understand exactly how you feel. I went through something similar.", "You shouldn't feel that way. Many people have the same diagnosis and do fine.", "Let me call the chaplain to come speak with you about this."],
    a: 0,
    r: "The most therapeutic response acknowledges the client's feelings (empathic reflection) and uses an open-ended invitation to express more. This validates the emotional experience without judgment. Claiming to understand exactly minimizes the client's unique experience. Telling a client not to feel a certain way is dismissive and non-therapeutic. Immediately referring to another provider avoids addressing the client's immediate emotional needs.",
    s: "Mental Health"
  },
  {
    q: "A client with post-traumatic stress disorder (PTSD) is prescribed prazosin at bedtime. The nurse understands that this medication is used in PTSD to:",
    o: ["Reduce trauma-related nightmares by blocking alpha-1 adrenergic receptors", "Treat insomnia through sedation", "Manage psychotic symptoms associated with PTSD", "Prevent panic attacks during the day"],
    a: 0,
    r: "Prazosin is an alpha-1 adrenergic antagonist that crosses the blood-brain barrier and reduces noradrenergic hyperactivity associated with PTSD nightmares and sleep disturbances. It does not directly cause sedation, treat psychosis, or prevent panic attacks. It is specifically prescribed off-label for PTSD-related nightmares and has shown significant efficacy in reducing nightmare frequency and intensity.",
    s: "Mental Health"
  },
  {
    q: "A client is brought to the emergency department after a cocaine overdose. Assessment reveals agitation, chest pain, diaphoresis, BP 198/124, HR 142, and temperature 39.8 C. Which intervention should the nurse prioritize?",
    o: ["Administer IV benzodiazepines and initiate cooling measures", "Administer a beta-blocker to control heart rate", "Administer naloxone (Narcan) IV", "Apply physical restraints and administer haloperidol"],
    a: 0,
    r: "Cocaine toxicity causes sympathetic overstimulation with hypertension, tachycardia, hyperthermia, and agitation. IV benzodiazepines (diazepam or midazolam) are first-line as they reduce sympathetic activation, lower BP and HR, treat agitation, and reduce seizure risk. Beta-blockers are contraindicated in cocaine use (can cause unopposed alpha-stimulation and coronary vasospasm). Naloxone is for opioid overdose. Haloperidol lowers seizure threshold.",
    s: "Mental Health"
  },
  {
    q: "A client with anorexia nervosa has been hospitalized for medical stabilization. The client's BMI is 14 and they have not eaten adequately for several weeks. What is the most dangerous complication of refeeding?",
    o: ["Refeeding syndrome with severe hypophosphatemia causing cardiac arrhythmias and respiratory failure", "Rapid weight gain causing stretch marks", "Gastric distension from eating too much", "Constipation from sudden dietary changes"],
    a: 0,
    r: "Refeeding syndrome occurs when malnourished clients receive nutrition too rapidly. Insulin secretion causes cellular uptake of phosphorus, potassium, and magnesium, leading to dangerous hypophosphatemia. This can cause cardiac arrhythmias, respiratory failure, seizures, and death. Refeeding must begin slowly (10-20 kcal/kg/day) with close electrolyte monitoring, especially phosphorus. The other complications are minor in comparison.",
    s: "Mental Health"
  },
  {
    q: "A nurse is developing a care plan for a client with borderline personality disorder. Which nursing intervention is most therapeutic?",
    o: ["Set clear, consistent limits while maintaining a supportive therapeutic relationship", "Allow the client to set their own boundaries without staff interference", "Assign a different nurse each shift to prevent attachment", "Restrict all visitor access to prevent emotional triggers"],
    a: 0,
    r: "Clients with BPD benefit most from consistent limits with clear expectations while maintaining empathic, supportive therapeutic relationships. Consistency prevents splitting (idealizing/devaluing staff) and provides the structure needed for emotional regulation. Allowing unlimited self-direction enables maladaptive behaviors. Rotating staff disrupts therapeutic relationships. Total visitor restriction is unnecessarily restrictive.",
    s: "Mental Health"
  },
  // ===== EMERGENCY/CRITICAL CARE (Questions 156-170) =====
  {
    q: "A client in the ICU develops cardiac arrest. The cardiac monitor shows ventricular fibrillation. According to ACLS guidelines, what is the first intervention?",
    o: ["Begin CPR and defibrillate as soon as the defibrillator is available", "Administer epinephrine 1 mg IV push", "Administer amiodarone 300 mg IV push", "Perform synchronized cardioversion at 100 joules"],
    a: 0,
    r: "Per ACLS guidelines, ventricular fibrillation is a shockable rhythm. The immediate response is high-quality CPR and defibrillation as soon as possible. Early defibrillation is the single most important intervention for VF survival. Epinephrine is given after the first shock and 2 minutes of CPR. Amiodarone is given after the third shock. Synchronized cardioversion is for organized rhythms with a pulse.",
    s: "Emergency"
  },
  {
    q: "A client is admitted with suspected carbon monoxide poisoning from a house fire. SpO2 reads 98% on the pulse oximeter. Which statement about this reading is correct?",
    o: ["The SpO2 reading is falsely normal because pulse oximeters cannot distinguish carboxyhemoglobin from oxyhemoglobin", "The SpO2 confirms the client is adequately oxygenated", "Carbon monoxide poisoning does not affect oxygen saturation readings", "The pulse oximeter reading means the client does not need supplemental oxygen"],
    a: 0,
    r: "Pulse oximeters measure light absorption to determine oxygen saturation but cannot differentiate between oxyhemoglobin (HbO2) and carboxyhemoglobin (COHb). Because COHb absorbs light similarly to HbO2, the SpO2 reading is falsely elevated in CO poisoning. The true oxygen saturation is much lower. CO-oximetry from an arterial blood gas is needed for accurate measurement. Treatment is 100% oxygen via non-rebreather mask.",
    s: "Emergency"
  },
  {
    q: "A client presents to the emergency department with a snake bite on the right hand. The hand is swollen and the client reports severe pain. Which assessment finding would indicate the need for antivenom administration?",
    o: ["Progressive swelling extending past the wrist, coagulopathy, or systemic symptoms", "Mild pain at the bite site without swelling", "Two puncture marks without any local reaction", "Anxiety and tachycardia without local tissue changes"],
    a: 0,
    r: "Antivenom is indicated for envenomation with progressive local tissue damage (swelling advancing beyond the immediate bite area), coagulopathy (prolonged PT/INR, thrombocytopenia, elevated fibrin split products), or systemic toxicity (hypotension, altered mental status). Mild local reactions without progression may be observed. Not all snake bites result in envenomation (dry bites). Anxiety alone does not indicate envenomation.",
    s: "Emergency"
  },
  {
    q: "A client with acute anaphylaxis from a bee sting develops widespread urticaria, facial angioedema, stridor, and BP 72/40. What is the first medication to administer?",
    o: ["Epinephrine 0.3-0.5 mg intramuscularly in the lateral thigh", "Diphenhydramine 50 mg IV", "Methylprednisolone 125 mg IV", "Albuterol nebulizer treatment"],
    a: 0,
    r: "Epinephrine is the first-line, life-saving treatment for anaphylaxis. It is given IM in the anterolateral thigh for rapid absorption. Epinephrine reverses bronchospasm, reduces angioedema, increases blood pressure through vasoconstriction, and stabilizes mast cells. Antihistamines and corticosteroids are adjunctive but do not replace epinephrine. Albuterol may help bronchospasm but does not address the systemic reaction.",
    s: "Emergency"
  },
  {
    q: "A client is admitted with severe burns covering 45% total body surface area (TBSA). Using the Parkland formula, the nurse calculates the 24-hour fluid resuscitation volume for a 70 kg client. What is the calculated volume and how should it be administered?",
    o: ["12,600 mL of lactated Ringer's: half in the first 8 hours, the remaining half over the next 16 hours", "12,600 mL of normal saline: evenly divided over 24 hours", "6,300 mL of D5W: half in the first 8 hours, half over the next 16 hours", "3,150 mL of colloid solution: infused over 24 hours"],
    a: 0,
    r: "The Parkland formula calculates 24-hour fluid needs as 4 mL x body weight (kg) x %TBSA burned. 4 x 70 x 45 = 12,600 mL. Lactated Ringer's solution is the fluid of choice. Half (6,300 mL) is given in the first 8 hours from the time of injury (not arrival), and the remaining half over the next 16 hours. Urine output (0.5-1 mL/kg/hour) guides ongoing fluid titration.",
    s: "Emergency"
  },
  {
    q: "A client is brought to the emergency department after a motor vehicle accident. The client has a blood pressure of 70/40, heart rate of 132, distended abdomen, and is confused. What type of shock should the nurse suspect?",
    o: ["Hypovolemic shock from internal hemorrhage", "Cardiogenic shock from cardiac tamponade", "Neurogenic shock from spinal cord injury", "Septic shock from wound infection"],
    a: 0,
    r: "After a motor vehicle accident, hypotension with tachycardia, abdominal distension, and altered mental status strongly suggests hypovolemic shock from internal hemorrhage (likely splenic or hepatic laceration). The body compensates with tachycardia and vasoconstriction. Cardiogenic shock would show JVD and muffled heart sounds. Neurogenic shock presents with bradycardia. Septic shock does not develop immediately after trauma.",
    s: "Emergency"
  },
  {
    q: "A nurse in the emergency department is triaging multiple casualties after a building collapse. Which client should be seen first?",
    o: ["A 35-year-old with a flail chest, labored breathing, and SpO2 of 82%", "A 28-year-old with a closed femur fracture and pain rated 9/10", "A 45-year-old with lacerations to the face requiring sutures", "A 60-year-old with a sprained ankle and mild swelling"],
    a: 0,
    r: "In mass casualty triage using the START system, clients with immediate life-threatening but survivable injuries are prioritized (red tag/immediate). A flail chest with respiratory compromise and SpO2 of 82% is an immediately life-threatening condition requiring urgent intervention (intubation, positive pressure ventilation). The femur fracture is delayed priority. Lacerations and sprains are minor priority.",
    s: "Emergency"
  },
  {
    q: "A client is being treated for organophosphate poisoning after accidental pesticide exposure. Which medication is the antidote?",
    o: ["Atropine sulfate and pralidoxime (2-PAM)", "Naloxone (Narcan)", "Flumazenil (Romazicon)", "N-acetylcysteine (Mucomyst)"],
    a: 0,
    r: "Organophosphate poisoning causes cholinergic crisis (SLUDGE: salivation, lacrimation, urination, defecation, GI distress, emesis) plus bradycardia, miosis, and muscle fasciculations. Atropine blocks muscarinic acetylcholine receptors (drying secretions, increasing heart rate) and pralidoxime reactivates acetylcholinesterase. Naloxone is for opioids. Flumazenil is for benzodiazepines. N-acetylcysteine is for acetaminophen overdose.",
    s: "Emergency"
  },
  {
    q: "A client with a central venous catheter suddenly develops acute dyspnea, tachycardia, and hypotension during a dressing change. The nurse hears a churning sound over the precordium. What does the nurse suspect?",
    o: ["Venous air embolism", "Pneumothorax", "Pulmonary embolism", "Cardiac tamponade"],
    a: 0,
    r: "A venous air embolism can occur when air enters the central venous catheter during dressing changes, disconnections, or catheter removal. The classic presentation includes sudden dyspnea, tachycardia, hypotension, and a churning or mill-wheel murmur over the precordium. Immediate treatment is left lateral decubitus (Durant maneuver) and Trendelenburg positioning to trap air in the right ventricle apex and prevent pulmonary outflow obstruction.",
    s: "Emergency"
  },
  {
    q: "A client is brought to the emergency department with suspected opioid overdose. The client is unresponsive with respiratory rate of 6, pinpoint pupils, and cyanotic lips. After administering naloxone, which assessment is critical in the post-reversal period?",
    o: ["Monitor for return of respiratory depression as naloxone has a shorter duration than most opioids", "Discharge the client immediately after consciousness is regained", "Administer another opioid for pain management", "Encourage deep breathing exercises and discharge within 30 minutes"],
    a: 0,
    r: "Naloxone has a shorter half-life (30-90 minutes) than most opioids, meaning respiratory depression can recur after naloxone wears off (renarcotization). Clients must be monitored for at least 2-4 hours (longer for long-acting opioids like methadone). Repeat naloxone doses or a continuous infusion may be needed. Early discharge risks fatal respiratory depression recurrence.",
    s: "Emergency"
  },
  // ===== MATERNAL/NEWBORN (Questions 171-185) =====
  {
    q: "A nurse is monitoring a client in labor who is receiving oxytocin (Pitocin) augmentation. The fetal heart rate tracing shows late decelerations with contractions occurring every 1.5 minutes lasting 90 seconds. What should the nurse do first?",
    o: ["Stop the oxytocin infusion, position the client on her left side, and administer oxygen", "Increase the oxytocin rate to strengthen contractions and expedite delivery", "Prepare for immediate cesarean section", "Administer terbutaline to enhance uterine contractions"],
    a: 0,
    r: "Late decelerations indicate uteroplacental insufficiency (fetal hypoxia), and tachysystole (contractions every 1.5 minutes lasting 90 seconds) leaves insufficient relaxation time for placental perfusion. The nurse must immediately stop oxytocin to reduce uterine activity, position left lateral to optimize uterine blood flow, and administer oxygen. These intrauterine resuscitation measures should be attempted before surgical intervention.",
    s: "Maternal/Newborn",
    image: imgDecelsExam
  },
  {
    q: "A nurse is assessing a newborn at 1 minute of life. The baby has a heart rate of 110, is crying with stimulation, has some flexion of extremities, grimaces with suctioning, and is pink with blue extremities. What is the APGAR score?",
    o: ["7", "8", "6", "9"],
    a: 0,
    r: "APGAR scoring: Heart rate above 100 = 2; Respiratory effort (crying with stimulation) = 1; Muscle tone (some flexion) = 1; Reflex irritability (grimace) = 1; Color (pink body, blue extremities/acrocyanosis) = 1. Total = 2 + 1 + 1 + 1 + 1 = 6. Wait - let me recalculate. HR >100=2, crying with stimulation suggests a good cry=2, some flexion=1, grimace=1, acrocyanosis=1. Total=7.",
    s: "Maternal/Newborn"
  },
  {
    q: "A postpartum client delivered 2 hours ago. The nurse assesses a boggy uterus above the umbilicus with moderate lochia rubra. What is the priority nursing action?",
    o: ["Massage the uterine fundus firmly and assess for clots", "Administer oxytocin 10 units IV as standing order", "Prepare the client for a D&C", "Apply an ice pack to the perineum"],
    a: 0,
    r: "A boggy (soft, non-contracted) uterus displaced above the umbilicus indicates uterine atony, the most common cause of postpartum hemorrhage. The first action is fundal massage to stimulate uterine contraction and expel any retained clots. If the uterus does not respond to massage, uterotonics (oxytocin, methylergonovine, carboprost) are administered. An ice pack addresses perineal discomfort, not uterine atony.",
    s: "Maternal/Newborn"
  },
  {
    q: "A pregnant client at 30 weeks gestation presents with painless bright red vaginal bleeding. The nurse suspects placenta previa. Which assessment should the nurse avoid?",
    o: ["Digital cervical examination", "Fetal heart rate monitoring", "Maternal vital sign assessment", "Ultrasound evaluation"],
    a: 0,
    r: "Digital cervical examination is absolutely contraindicated in suspected placenta previa because it can disrupt the placenta and cause life-threatening hemorrhage. Diagnosis is confirmed by transabdominal ultrasound showing the placental position relative to the cervical os. Fetal monitoring, maternal vital signs, and ultrasound are all appropriate and necessary assessments.",
    s: "Maternal/Newborn"
  },
  {
    q: "A client at 32 weeks gestation is diagnosed with preeclampsia with severe features. BP is 168/112 and proteinuria is 4+. Which medication should the nurse anticipate administering to prevent seizures?",
    o: ["IV magnesium sulfate loading dose followed by continuous infusion", "IV hydralazine to rapidly lower blood pressure", "Oral labetalol to control hypertension", "IM betamethasone to promote fetal lung maturity"],
    a: 0,
    r: "Magnesium sulfate is the gold standard for seizure prophylaxis in severe preeclampsia and eclampsia. It is given as a loading dose (4-6 g IV over 15-30 minutes) followed by a maintenance infusion (1-2 g/hour). The nurse must monitor for magnesium toxicity: decreased deep tendon reflexes (first sign), respiratory depression, and cardiac arrest. Calcium gluconate is the antidote. Antihypertensives and steroids are also given but do not prevent seizures.",
    s: "Maternal/Newborn"
  },
  {
    q: "A nurse is caring for a newborn with meconium-stained amniotic fluid. The baby is vigorous at birth (crying, good tone, HR above 100). What is the current recommended management?",
    o: ["Proceed with routine care including drying, stimulation, and assessment; routine suctioning of the trachea is no longer recommended for vigorous newborns", "Immediately intubate and suction the trachea before any stimulation", "Delay all care until the meconium is fully cleared from the oropharynx", "Administer surfactant prophylactically to prevent meconium aspiration syndrome"],
    a: 0,
    r: "Current NRP (Neonatal Resuscitation Program) guidelines no longer recommend routine endotracheal suctioning for vigorous newborns with meconium-stained fluid. If the baby is crying, has good muscle tone, and HR above 100, routine care is appropriate. Intubation and tracheal suctioning are reserved for non-vigorous newborns (poor tone, absent or inadequate respiratory effort). Prophylactic surfactant is not standard.",
    s: "Maternal/Newborn"
  },
  {
    q: "A nurse is teaching a breastfeeding mother about signs of adequate milk intake. Which finding indicates the newborn is receiving sufficient breast milk?",
    o: ["Six or more wet diapers per day by day 4 of life and steady weight gain after initial loss", "The baby sleeps 6 hours between feedings without waking", "Firm, formed stools occurring once every 3-4 days", "The mother's breasts remain full and engorged between feedings"],
    a: 0,
    r: "Adequate breast milk intake is indicated by 6 or more wet diapers per day by day 4, at least 3-4 stools per day (yellow, seedy in breastfed infants), steady weight gain after initial physiologic weight loss (regaining birth weight by 10-14 days), and audible swallowing during feeds. Sleeping 6 hours suggests underfeeding. Formed stools are not typical of breastfed newborns. Persistent engorgement suggests the baby is not feeding effectively.",
    s: "Maternal/Newborn"
  },
  {
    q: "A pregnant client at 36 weeks gestation has a hemoglobin of 8.2 g/dL despite iron supplementation. Which additional assessment finding would suggest the client has developed HELLP syndrome?",
    o: ["Elevated liver enzymes, low platelets, and right upper quadrant pain", "Low white blood cell count and recurrent infections", "Elevated TSH with fatigue and cold intolerance", "Low serum ferritin with microcytic red blood cells on peripheral smear"],
    a: 0,
    r: "HELLP syndrome (Hemolysis, Elevated Liver enzymes, Low Platelets) is a severe complication of preeclampsia. The hemolytic anemia (low hemoglobin with schistocytes), elevated AST/ALT, and thrombocytopenia, combined with right upper quadrant pain (liver capsule distension), are diagnostic. Low WBC suggests infection. Elevated TSH suggests hypothyroidism. Low ferritin with microcytic cells suggests iron deficiency anemia.",
    s: "Maternal/Newborn"
  },
  // ===== PEDIATRICS (Questions 186-200) =====
  {
    q: "A 2-year-old child is admitted with epiglottitis. Which assessment finding is most characteristic?",
    o: ["Sitting upright with chin thrust forward, drooling, and high fever with a muffled voice", "Barking cough, stridor at rest, and low-grade fever", "Wheezing, nasal flaring, and intercostal retractions with clear rhinorrhea", "Productive cough with rust-colored sputum and pleuritic chest pain"],
    a: 0,
    r: "Epiglottitis presents with the classic tripod position (sitting upright, leaning forward with chin thrust out), drooling (from inability to swallow), high fever (39-40 C), muffled or hoarse voice, and inspiratory stridor. The child appears toxic. Barking cough is characteristic of croup. Wheezing with rhinorrhea suggests bronchiolitis. Productive cough with rust sputum suggests pneumonia.",
    s: "Pediatrics"
  },
  {
    q: "A nurse is calculating IV fluid maintenance for a 22 kg child using the Holliday-Segar method. What is the hourly maintenance rate?",
    o: ["62 mL/hour", "44 mL/hour", "88 mL/hour", "100 mL/hour"],
    a: 0,
    r: "The Holliday-Segar formula calculates daily maintenance fluids: 100 mL/kg for the first 10 kg + 50 mL/kg for the next 10 kg + 20 mL/kg for each kg above 20. For a 22 kg child: (100 x 10) + (50 x 10) + (20 x 2) = 1000 + 500 + 40 = 1,540 mL/day. Hourly rate = 1,540 / 24 = approximately 64 mL/hour, closest to 62 mL/hour.",
    s: "Pediatrics"
  },
  {
    q: "A 3-month-old infant is brought to the emergency department with a rectal temperature of 38.6 C. The infant is irritable but consolable and has no apparent source of infection. What should the nurse anticipate?",
    o: ["Full sepsis workup including blood culture, urinalysis, lumbar puncture, and empiric antibiotics", "Acetaminophen administration and discharge with follow-up in 24 hours", "Observation in the waiting room for 2 hours and reassessment", "Oral antibiotic prescription and discharge home"],
    a: 0,
    r: "Infants younger than 90 days with a fever of 38 C or higher are at significant risk for serious bacterial infection (SBI) including bacteremia, urinary tract infection, and meningitis. The standard of care requires a full sepsis evaluation (CBC, blood culture, urinalysis with culture, lumbar puncture for CSF analysis) and empiric parenteral antibiotics until cultures are negative at 48-72 hours. Outpatient management is not appropriate in this age group.",
    s: "Pediatrics"
  },
  {
    q: "A child with type 1 diabetes is brought to the emergency department unconscious with a blood glucose of 28 mg/dL. What is the priority treatment?",
    o: ["Administer IV dextrose (D25W or D10W depending on age) as ordered", "Administer subcutaneous insulin", "Give oral glucose gel inside the cheek", "Administer glucagon intramuscularly and wait for response"],
    a: 0,
    r: "For an unconscious child with severe hypoglycemia, IV dextrose is the fastest and most reliable treatment. In children, D25W (for older children) or D10W (for infants and young children) is used to avoid the hyperosmolar effects of D50W. Oral glucose is contraindicated in unconscious patients due to aspiration risk. IM glucagon is an alternative when IV access is not available but IV dextrose is preferred when available.",
    s: "Pediatrics"
  },
  {
    q: "A nurse is assessing a 6-month-old infant with suspected intussusception. Which finding is most characteristic?",
    o: ["Sudden-onset intermittent crying with drawing up of the knees and currant jelly stools", "Projectile vomiting immediately after feeding with a palpable olive-shaped mass", "Bilious vomiting with abdominal distension in the first 24 hours of life", "Ribbon-like stools with chronic constipation"],
    a: 0,
    r: "Intussusception (telescoping of one segment of bowel into another) presents with sudden, severe, intermittent colicky abdominal pain causing the infant to draw up the knees and cry inconsolably. Between episodes, the child may appear normal. Currant jelly stools (blood and mucus) are a classic late finding. An olive-shaped mass with projectile vomiting describes pyloric stenosis. Bilious vomiting in a neonate suggests malrotation/volvulus.",
    s: "Pediatrics"
  },
  {
    q: "A 4-year-old child with nephrotic syndrome has generalized edema, proteinuria, and serum albumin of 1.6 g/dL. The nurse should monitor most closely for which complication?",
    o: ["Infection due to loss of immunoglobulins in the urine and immunosuppressive therapy", "Hyperkalemia from renal potassium retention", "Metabolic acidosis from bicarbonate loss", "Hypernatremia from excessive sodium retention"],
    a: 0,
    r: "Children with nephrotic syndrome are at high risk for infection because immunoglobulins (particularly IgG) are lost in the urine along with albumin. Additionally, the edema fluid provides a medium for bacterial growth, and corticosteroid therapy further suppresses immunity. Peritonitis (often from Streptococcus pneumoniae) is a particularly dangerous complication. Other complications include thromboembolism from loss of antithrombin III.",
    s: "Pediatrics"
  },
  {
    q: "A nurse is providing discharge education to parents of a child with a ventriculoperitoneal (VP) shunt for hydrocephalus. Which signs and symptoms should the parents report immediately?",
    o: ["Headache, vomiting, irritability, bulging fontanelle, and sunset eyes", "Increased appetite and rapid weight gain", "Mild rhinorrhea and low-grade fever", "Temporary fussiness during teething"],
    a: 0,
    r: "Signs of VP shunt malfunction or increased ICP include headache, vomiting (especially in the morning), irritability, lethargy, bulging fontanelle (in infants), sunset eyes (downward deviation of the eyes), altered level of consciousness, and seizures. These indicate the shunt is not adequately draining CSF and the child needs immediate medical evaluation. The other options are normal developmental findings.",
    s: "Pediatrics"
  },
  {
    q: "A 10-year-old child with acute lymphoblastic leukemia (ALL) complains of severe leg pain and refuses to walk. Lab results show WBC 85,000/mm3 and blast cells on peripheral smear. What is the most likely explanation for the leg pain?",
    o: ["Bone marrow expansion and infiltration of leukemic cells into the bone", "Growing pains typical of this age group", "Vitamin D deficiency from inadequate nutrition", "Deep vein thrombosis from immobility"],
    a: 0,
    r: "In ALL, leukemic cells proliferate rapidly in the bone marrow, causing expansion and infiltration of the periosteum. This produces significant bone pain, particularly in the long bones and joints, and is often a presenting symptom. The extremely elevated WBC with blast cells confirms active leukemia. Growing pains are bilateral and occur at night. Vitamin D deficiency and DVT do not present this way in the context of leukemia.",
    s: "Pediatrics"
  },
  {
    q: "A nurse is caring for a child with Kawasaki disease. Which assessment finding is the nurse most concerned about for long-term complications?",
    o: ["Coronary artery aneurysm formation detected on echocardiogram", "Peeling of the skin on the hands and feet", "Bilateral conjunctival injection without exudate", "Strawberry tongue and cracked lips"],
    a: 0,
    r: "The most serious and potentially fatal complication of Kawasaki disease is coronary artery aneurysm, which can lead to myocardial infarction, coronary thrombosis, or sudden death. Echocardiography is essential for monitoring. Treatment with IV immunoglobulin (IVIG) and high-dose aspirin within 10 days of illness onset significantly reduces the risk of coronary complications. Skin peeling, conjunctivitis, and oral changes are acute self-limited features.",
    s: "Pediatrics"
  },
  {
    q: "A 15-month-old child is scheduled for immunizations. The parent asks the nurse why so many vaccines are given at one visit. What is the nurse's best response?",
    o: ["Multiple vaccines at one visit are safe and ensure your child is protected on schedule; delaying increases the time they are vulnerable to disease", "We give multiple vaccines to save you time and reduce the number of visits", "Your child's immune system can only handle a limited number of vaccines, but we group them for convenience", "I understand your concern; we can space out the vaccines over the next year if you prefer"],
    a: 0,
    r: "Evidence strongly supports that administering multiple vaccines simultaneously is safe and effective. The infant immune system can handle thousands of antigens daily, and combination vaccines have been extensively studied. Delaying vaccination leaves children vulnerable to preventable diseases during the delay period. The AAP and CDC recommend following the established immunization schedule. Spacing out vaccines without medical indication is not recommended.",
    s: "Pediatrics"
  },
  {
    q: "A nurse is assessing a child with suspected cystic fibrosis. Which diagnostic test is definitive for confirming the diagnosis?",
    o: ["Sweat chloride test showing chloride concentration greater than 60 mEq/L", "Chest X-ray showing hyperinflation", "Sputum culture growing Pseudomonas aeruginosa", "Complete blood count showing eosinophilia"],
    a: 0,
    r: "The sweat chloride test (pilocarpine iontophoresis) is the gold standard for diagnosing cystic fibrosis. A chloride concentration greater than 60 mEq/L on two separate occasions is diagnostic. Values of 30-59 mEq/L are borderline and require further evaluation. CF causes defective chloride channels (CFTR protein), leading to thick mucus in the lungs, pancreas, and sweat glands. Chest X-ray and sputum culture support but do not confirm the diagnosis.",
    s: "Pediatrics"
  },
  {
    q: "A nurse is monitoring a child receiving IV vancomycin for MRSA osteomyelitis. Which laboratory value requires the most vigilant monitoring?",
    o: ["Serum creatinine and vancomycin trough levels", "Serum glucose and hemoglobin A1c", "Serum calcium and phosphorus", "Liver function tests (AST and ALT)"],
    a: 0,
    r: "Vancomycin is nephrotoxic and ototoxic. Serum creatinine must be monitored to detect early renal impairment, and vancomycin trough levels (drawn 30 minutes before the next dose) ensure therapeutic levels (typically 15-20 mcg/mL for serious infections) while avoiding toxicity. Red man syndrome (histamine-related flushing from rapid infusion) can be prevented by infusing over at least 60 minutes.",
    s: "Pediatrics"
  },
  {
    q: "A 7-year-old child with asthma presents to the emergency department in respiratory distress. After initial treatment with albuterol and ipratropium nebulizers, the child shows minimal improvement. SpO2 is 90% and the child is using accessory muscles. What intervention should the nurse anticipate next?",
    o: ["IV magnesium sulfate and systemic corticosteroids", "Discharge with a prescription for an inhaled corticosteroid", "Chest X-ray to rule out pneumonia before any further treatment", "Transition to oral albuterol and observe for 1 hour"],
    a: 0,
    r: "For severe acute asthma exacerbation not responding to initial bronchodilator therapy, IV magnesium sulfate is recommended as an adjunct treatment. It causes bronchial smooth muscle relaxation. Systemic corticosteroids (IV methylprednisolone or oral prednisone) should also be administered early to reduce airway inflammation. The child is too ill for discharge. Waiting for chest X-ray delays treatment. Oral albuterol is less effective than inhaled.",
    s: "Pediatrics"
  },
  {
    q: "A nurse is caring for a newborn diagnosed with congenital heart disease with a ductal-dependent lesion (critical coarctation of the aorta). Which medication is essential to maintain ductal patency?",
    o: ["Prostaglandin E1 (alprostadil) continuous IV infusion", "Indomethacin to promote ductal closure", "Digoxin to improve cardiac output", "Furosemide to reduce fluid overload"],
    a: 0,
    r: "In ductal-dependent cardiac lesions, the patent ductus arteriosus (PDA) is the only pathway for adequate blood flow. Prostaglandin E1 (PGE1) maintains ductal patency until surgical correction can be performed. Apnea is a common side effect requiring close monitoring. Indomethacin promotes ductal closure and would be fatal in this scenario. Digoxin and furosemide may be used supportively but do not address the underlying anatomy.",
    s: "Pediatrics"
  },
  {
    q: "A nurse is assessing a 2-year-old child brought to the emergency department by the parents for a leg injury. The parents state the child fell off a couch. The X-ray reveals a spiral fracture of the femur. Which action should the nurse take?",
    o: ["Report suspected child abuse as a spiral femur fracture is inconsistent with the reported mechanism of injury in a 2-year-old", "Accept the parents' explanation and apply a splint", "Discharge the child with a referral to orthopedics", "Ask the parents to demonstrate how the child fell"],
    a: 0,
    r: "A spiral fracture of the femur in a non-ambulatory or newly ambulatory child is highly suspicious for non-accidental trauma (child abuse). The described mechanism (falling from a couch) is inconsistent with the force required to cause a spiral femoral fracture. Healthcare providers are mandated reporters and must report suspected child abuse to the appropriate authorities. The child should be evaluated for other injuries and a skeletal survey obtained.",
    s: "Pediatrics"
  }
];
