import type { ExamQuestion } from "./types";

export const rnPharmacologyQuestions: ExamQuestion[] = [
  // ===== CARDIAC DRUGS (Questions 1-8) =====
  {
    q: "A client is prescribed digoxin 0.25 mg daily for heart failure. Before administering the medication, the nurse obtains an apical pulse of 54 bpm. What is the appropriate nursing action?",
    o: ["Hold the medication and notify the healthcare provider", "Administer the medication as ordered", "Administer the medication and recheck the pulse in one hour", "Give half the dose and reassess in 30 minutes"],
    a: 0,
    r: "Digoxin should be held when the apical pulse is below 60 bpm in adults due to the risk of toxicity-related bradycardia and heart block. The healthcare provider must be notified to evaluate the need for a digoxin level and to adjust the dosing regimen. Administering the dose could worsen bradycardia. Partial dosing is not standard practice without an order.",
    s: "Pharmacology"
  },
  {
    q: "A nurse is monitoring a client who is receiving an amiodarone IV infusion for ventricular tachycardia. Which assessment finding requires immediate intervention?",
    o: ["Blood pressure of 78/50 mmHg", "Heart rate of 68 bpm", "Respiratory rate of 18 breaths per minute", "Oral temperature of 37.1 degrees Celsius"],
    a: 0,
    r: "Amiodarone can cause significant hypotension, especially during IV infusion, due to its vasodilatory effects. A BP of 78/50 is critically low and requires slowing or stopping the infusion and notifying the provider. The other vital signs are within normal limits and do not require immediate intervention.",
    s: "Pharmacology"
  },
  {
    q: "A client with acute decompensated heart failure is started on an IV dobutamine infusion. The nurse understands that the primary therapeutic effect of this medication is to:",
    o: ["Increase myocardial contractility", "Decrease heart rate", "Reduce preload through vasodilation", "Promote diuresis"],
    a: 0,
    r: "Dobutamine is a beta-1 adrenergic agonist that increases myocardial contractility (positive inotropic effect), improving cardiac output in decompensated heart failure. It does not primarily decrease heart rate; it may increase it slightly. While improved cardiac output may indirectly improve renal perfusion, diuresis is not its primary mechanism.",
    s: "Pharmacology"
  },
  {
    q: "A nurse is caring for a client who received tissue plasminogen activator (tPA) 2 hours ago for an acute ST-elevation myocardial infarction. Which finding should the nurse report immediately?",
    o: ["Frank blood in the urine", "Ecchymosis at the IV insertion site", "Blood pressure of 128/76 mmHg", "Mild headache rated 2 out of 10"],
    a: 0,
    r: "Frank hematuria after thrombolytic therapy indicates significant internal bleeding, which is a life-threatening complication. tPA dissolves clots systemically, increasing bleeding risk. Minor bruising at the IV site is expected. The blood pressure is normal. A mild headache alone is not emergent but should be monitored for worsening.",
    s: "Pharmacology"
  },
  {
    q: "A client with hypertrophic cardiomyopathy is prescribed metoprolol. The nurse understands that the therapeutic goal of this medication for this condition is to:",
    o: ["Reduce myocardial oxygen demand and decrease outflow tract obstruction", "Increase heart rate to improve diastolic filling", "Promote vasodilation to reduce afterload", "Enhance AV node conduction"],
    a: 0,
    r: "Beta-blockers like metoprolol reduce heart rate and contractility, which decreases myocardial oxygen demand and reduces the dynamic outflow tract obstruction seen in hypertrophic cardiomyopathy. Increasing heart rate would reduce filling time. Vasodilation could worsen obstruction. Enhanced conduction is not the goal.",
    s: "Pharmacology"
  },
  {
    q: "A client is receiving a continuous IV infusion of nitroglycerin for unstable angina. The nurse notes the blood pressure has dropped to 84/52 mmHg. What is the priority nursing action?",
    o: ["Reduce the infusion rate and place the client in a supine position", "Stop the infusion and administer a fluid bolus without an order", "Increase the infusion rate to improve coronary perfusion", "Administer sublingual nitroglycerin for additional symptom relief"],
    a: 0,
    r: "Nitroglycerin causes vasodilation, which reduces preload and can lead to hypotension. The infusion rate should be decreased and the client placed supine to improve venous return. Stopping abruptly may cause rebound ischemia. Increasing the dose would worsen hypotension. Sublingual nitroglycerin would further reduce blood pressure.",
    s: "Pharmacology"
  },
  {
    q: "A nurse is administering IV adenosine to a client with supraventricular tachycardia. Which administration technique is essential for this medication?",
    o: ["Rapid IV push over 1 to 2 seconds followed by a normal saline flush", "Slow IV infusion over 30 minutes via an infusion pump", "Intramuscular injection in the deltoid muscle", "Subcutaneous injection in the abdominal tissue"],
    a: 0,
    r: "Adenosine has an extremely short half-life of less than 10 seconds and must be given as a rapid IV push closest to the heart, followed immediately by a rapid saline flush to ensure the drug reaches the heart before degradation. Slow administration renders it ineffective. It is only given IV, not IM or subcutaneously.",
    s: "Pharmacology"
  },
  {
    q: "A client receiving IV diltiazem for rate control in atrial fibrillation develops a heart rate of 42 bpm and becomes diaphoretic. Which medication should the nurse anticipate administering?",
    o: ["Atropine sulfate", "Epinephrine", "Amiodarone", "Verapamil"],
    a: 0,
    r: "Atropine is the first-line treatment for symptomatic bradycardia. Diltiazem, a calcium channel blocker, can cause excessive bradycardia. Atropine blocks vagal tone to increase heart rate. Epinephrine is used for cardiac arrest or severe allergic reactions. Amiodarone and verapamil would further decrease heart rate.",
    s: "Pharmacology"
  },
  // ===== ANTICOAGULANTS (Questions 9-16) =====
  {
    q: "A client is receiving a heparin infusion and has an aPTT of 120 seconds (therapeutic range 60-80 seconds). The nurse should anticipate which action?",
    o: ["Stop the infusion and notify the healthcare provider", "Continue the infusion at the current rate", "Increase the infusion rate to achieve therapeutic levels", "Administer a bolus dose of heparin"],
    a: 0,
    r: "An aPTT of 120 seconds is significantly above the therapeutic range, indicating excessive anticoagulation and a high risk of hemorrhage. The infusion should be stopped immediately and the provider notified for dose adjustment. Continuing or increasing the infusion would further increase bleeding risk. An additional bolus is contraindicated.",
    s: "Pharmacology"
  },
  {
    q: "A nurse is caring for a client taking warfarin who has an INR of 5.2 with no signs of active bleeding. Which intervention does the nurse anticipate?",
    o: ["Hold warfarin and administer oral vitamin K as prescribed", "Continue warfarin at the current dose", "Administer IV protamine sulfate", "Administer fresh frozen plasma immediately"],
    a: 0,
    r: "An INR of 5.2 is supratherapeutic (therapeutic range 2.0-3.0), placing the client at high bleeding risk. Without active bleeding, the standard approach is to hold warfarin and administer low-dose oral vitamin K. Protamine sulfate reverses heparin, not warfarin. Fresh frozen plasma is reserved for active, serious bleeding or emergent reversal.",
    s: "Pharmacology"
  },
  {
    q: "A client on enoxaparin (Lovenox) is scheduled for an elective hip replacement. The nurse should plan to hold the last dose of enoxaparin how many hours before surgery?",
    o: ["24 hours before the procedure", "2 hours before the procedure", "Immediately before transport to the operating room", "48 hours before the procedure"],
    a: 0,
    r: "Enoxaparin should be held at least 24 hours before elective surgery to reduce the risk of surgical bleeding. Its anticoagulant effect persists for approximately 12 to 24 hours. Holding for only 2 hours is insufficient. Immediately before surgery provides no clearance time. While 48 hours is safe, it is unnecessarily prolonged and could increase thromboembolic risk.",
    s: "Pharmacology"
  },
  {
    q: "A client receiving rivaroxaban (Xarelto) for deep vein thrombosis asks why routine blood monitoring is not required. The nurse's best response is:",
    o: ["Rivaroxaban has predictable pharmacokinetics and does not require routine coagulation monitoring", "The medication does not affect blood clotting at all", "Blood monitoring is only needed for injectable anticoagulants", "The pharmacy monitors the levels automatically"],
    a: 0,
    r: "Direct oral anticoagulants like rivaroxaban have predictable dose-response relationships, fixed dosing, and fewer drug-food interactions compared to warfarin, eliminating the need for routine coagulation monitoring. The drug does affect clotting by inhibiting Factor Xa. All anticoagulants affect clotting regardless of route. Pharmacies do not independently monitor drug levels.",
    s: "Pharmacology"
  },
  {
    q: "A nurse is preparing to administer subcutaneous enoxaparin. Which technique demonstrates correct administration?",
    o: ["Inject into the anterolateral abdominal wall without aspirating or rubbing the site", "Inject into the deltoid muscle with aspiration before injection", "Inject into the ventrogluteal site using the Z-track technique", "Inject into the abdomen and massage the site to promote absorption"],
    a: 0,
    r: "Enoxaparin is administered subcutaneously into the anterolateral abdominal wall. Aspiration is not recommended as it can cause tissue damage. Rubbing or massaging the site increases the risk of bruising and hematoma formation. It is not given intramuscularly. The deltoid and ventrogluteal sites are for IM injections.",
    s: "Pharmacology"
  },
  {
    q: "A client on warfarin therapy reports eating a large spinach salad daily for the past week. The nurse anticipates that this dietary change will most likely cause:",
    o: ["A decrease in the INR due to increased vitamin K intake", "An increase in the INR due to enhanced drug absorption", "No change in the INR", "A decrease in platelet count"],
    a: 0,
    r: "Spinach is high in vitamin K, which antagonizes warfarin's mechanism of action. Increased vitamin K intake promotes clotting factor synthesis, decreasing the INR and reducing the anticoagulant effect. This does not enhance drug absorption or increase INR. Dietary vitamin K does not directly affect platelet counts.",
    s: "Pharmacology"
  },
  {
    q: "A client on a heparin drip develops heparin-induced thrombocytopenia (HIT). The nurse should anticipate which immediate action?",
    o: ["Discontinue all heparin products and initiate an alternative anticoagulant such as argatroban", "Decrease the heparin infusion rate by half", "Switch to enoxaparin (low-molecular-weight heparin)", "Administer a platelet transfusion immediately"],
    a: 0,
    r: "HIT is an immune-mediated condition requiring immediate discontinuation of all heparin products, including heparin flushes. An alternative non-heparin anticoagulant such as argatroban or bivalirudin is initiated because HIT paradoxically increases thrombotic risk. LMWH is contraindicated in HIT due to cross-reactivity. Platelet transfusions can worsen thrombosis in HIT.",
    s: "Pharmacology"
  },
  {
    q: "A client who received too much unfractionated heparin is experiencing significant bleeding. Which medication should the nurse anticipate administering as the antidote?",
    o: ["Protamine sulfate", "Vitamin K (phytonadione)", "Idarucizumab (Praxbind)", "Aminocaproic acid"],
    a: 0,
    r: "Protamine sulfate is the specific antidote for unfractionated heparin. It binds to heparin and neutralizes its anticoagulant effect. Vitamin K reverses warfarin. Idarucizumab reverses dabigatran. Aminocaproic acid is an antifibrinolytic used to treat fibrinolysis, not heparin overdose.",
    s: "Pharmacology"
  },
  // ===== ANTIHYPERTENSIVES (Questions 17-23) =====
  {
    q: "A client is started on lisinopril for hypertension. The nurse should monitor for which common adverse effect during the first few weeks of therapy?",
    o: ["Persistent dry cough", "Productive cough with yellow sputum", "Wheezing and chest tightness", "Hemoptysis"],
    a: 0,
    r: "ACE inhibitors such as lisinopril commonly cause a persistent dry cough due to accumulation of bradykinin in the lungs. This occurs in up to 20% of clients and may necessitate switching to an ARB. A productive cough suggests infection. Wheezing suggests bronchospasm. Hemoptysis is not an expected side effect.",
    s: "Pharmacology"
  },
  {
    q: "A client taking losartan (Cozaar) has a potassium level of 5.8 mEq/L. The nurse should take which immediate action?",
    o: ["Hold the medication and notify the healthcare provider", "Encourage the client to eat a banana for additional potassium", "Administer a potassium supplement", "Continue the medication and recheck labs in one week"],
    a: 0,
    r: "ARBs like losartan can cause hyperkalemia by reducing aldosterone secretion. A potassium level of 5.8 mEq/L is dangerously elevated (normal 3.5-5.0) and places the client at risk for cardiac dysrhythmias. The medication should be held and the provider notified. Adding potassium would be harmful. Waiting one week is unsafe.",
    s: "Pharmacology"
  },
  {
    q: "A client is receiving IV labetalol for a hypertensive crisis. The nurse should monitor most closely for which adverse effect?",
    o: ["Severe bradycardia", "Hyperglycemia", "Urinary retention", "Tinnitus"],
    a: 0,
    r: "Labetalol is an alpha and beta adrenergic blocker. Beta-blockade can cause significant bradycardia, especially when given intravenously. The nurse must monitor heart rate and rhythm continuously during infusion. Beta-blockers may mask hypoglycemia, not cause hyperglycemia. Urinary retention and tinnitus are not primary concerns with labetalol.",
    s: "Pharmacology"
  },
  {
    q: "A nurse is teaching a client about the first dose of prazosin (Minipress) for benign prostatic hyperplasia. Which instruction is most important?",
    o: ["Take the first dose at bedtime to minimize the risk of orthostatic hypotension", "Take the medication with a high-fat meal for better absorption", "Expect a significant increase in blood pressure after the first dose", "Avoid drinking any fluids for 2 hours after taking the medication"],
    a: 0,
    r: "Prazosin is an alpha-1 blocker that causes significant first-dose orthostatic hypotension (first-dose syncope). Taking the first dose at bedtime reduces the risk of falls and syncope. Food does not significantly affect absorption. The medication lowers, not increases, blood pressure. Fluid restriction is not necessary.",
    s: "Pharmacology"
  },
  {
    q: "A client is prescribed amlodipine (Norvasc) for hypertension. After two weeks of therapy, the client reports bilateral ankle swelling. The nurse should explain that this is:",
    o: ["A common side effect of calcium channel blockers caused by peripheral vasodilation", "A sign of heart failure requiring immediate emergency care", "An allergic reaction requiring discontinuation of the medication", "An expected sign that the medication is working effectively"],
    a: 0,
    r: "Peripheral edema, particularly ankle swelling, is a common side effect of dihydropyridine calcium channel blockers like amlodipine. It results from arteriolar vasodilation and increased capillary hydrostatic pressure, not fluid overload. It is not typically a sign of heart failure or allergy. While common, it should be reported to the provider for evaluation.",
    s: "Pharmacology"
  },
  {
    q: "A client taking clonidine (Catapres) for hypertension states they want to stop taking the medication because of side effects. The nurse's best response is:",
    o: ["Do not stop this medication suddenly as it can cause rebound hypertension", "You can stop at any time since blood pressure medications are not habit forming", "Stopping suddenly will cause your blood pressure to drop too low", "You should double the dose for a few days then stop"],
    a: 0,
    r: "Clonidine is a central alpha-2 agonist that must be tapered gradually. Abrupt discontinuation can cause rebound hypertensive crisis with dangerously elevated blood pressure, tachycardia, and anxiety. It will not cause hypotension upon stopping. Doubling the dose is dangerous. The client should consult their provider for a tapering schedule.",
    s: "Pharmacology"
  },
  {
    q: "A nurse is administering IV hydralazine to a postpartum client with severe preeclampsia. Which assessment is the highest priority during administration?",
    o: ["Continuous blood pressure monitoring for hypotension and reflex tachycardia", "Monitoring for hyperglycemia", "Assessing for decreased urinary output due to the medication", "Monitoring serum calcium levels"],
    a: 0,
    r: "Hydralazine is a direct vasodilator that can cause rapid blood pressure reduction and reflex tachycardia. Continuous BP monitoring is essential to prevent maternal hypotension, which could compromise uteroplacental perfusion. Hydralazine does not cause hyperglycemia. While urine output is monitored in preeclampsia, it is not the primary concern with hydralazine. Calcium monitoring is relevant for magnesium sulfate, not hydralazine.",
    s: "Pharmacology"
  },
  // ===== ANTIBIOTICS (Questions 24-31) =====
  {
    q: "A client is receiving IV vancomycin for methicillin-resistant Staphylococcus aureus (MRSA) bacteremia. The nurse should monitor for which serious adverse effect?",
    o: ["Ototoxicity and nephrotoxicity", "Hepatotoxicity and jaundice", "Hypoglycemia and seizures", "Pulmonary fibrosis"],
    a: 0,
    r: "Vancomycin is associated with ototoxicity (hearing loss, tinnitus) and nephrotoxicity (elevated BUN and creatinine). Trough levels should be monitored to maintain therapeutic levels while minimizing toxicity. Hepatotoxicity is not a primary concern with vancomycin. Hypoglycemia and seizures are not typical adverse effects. Pulmonary fibrosis is associated with other medications.",
    s: "Pharmacology"
  },
  {
    q: "A client receiving IV vancomycin develops facial flushing, erythema of the neck and upper torso, and hypotension during the infusion. The nurse recognizes this as:",
    o: ["Red man syndrome caused by rapid infusion", "An anaphylactic reaction requiring epinephrine", "A sign of MRSA sepsis worsening", "A normal expected response to the medication"],
    a: 0,
    r: "Red man syndrome is a histamine-mediated reaction caused by too-rapid infusion of vancomycin. It presents with flushing, erythema of the face, neck, and upper body, and hypotension. Treatment includes slowing or stopping the infusion and administering diphenhydramine. It is not a true allergy. It is preventable by infusing over at least 60 minutes.",
    s: "Pharmacology"
  },
  {
    q: "A nurse is preparing to administer gentamicin to a client with a serious gram-negative infection. Which lab value is most important to review before administration?",
    o: ["Serum creatinine level", "Serum glucose level", "Hemoglobin A1C", "Serum albumin level"],
    a: 0,
    r: "Aminoglycosides such as gentamicin are nephrotoxic and require monitoring of renal function through serum creatinine and BUN levels. Dose adjustments are made based on renal function to prevent accumulation and toxicity. Blood glucose, A1C, and albumin are not directly relevant to gentamicin safety monitoring.",
    s: "Pharmacology"
  },
  {
    q: "A client taking ciprofloxacin (Cipro) reports new-onset Achilles tendon pain. The nurse should take which action?",
    o: ["Hold the medication and notify the healthcare provider immediately", "Encourage the client to continue exercising through the pain", "Apply ice and continue the medication as prescribed", "Reassure the client that this is a common and harmless side effect"],
    a: 0,
    r: "Fluoroquinolones carry a Black Box Warning for tendinitis and tendon rupture, particularly of the Achilles tendon. The medication should be stopped immediately and the provider notified. The client should rest the affected tendon. Exercising through the pain could cause rupture. This is not a harmless side effect; it can result in permanent disability.",
    s: "Pharmacology"
  },
  {
    q: "A client with a penicillin allergy is prescribed cephalexin (Keflex) for a urinary tract infection. The nurse's most appropriate action is to:",
    o: ["Verify the type and severity of the penicillin allergy before administering", "Refuse to administer the medication under any circumstances", "Administer the medication without concern as there is no cross-reactivity", "Substitute a macrolide antibiotic without a provider order"],
    a: 0,
    r: "There is a small cross-reactivity risk (approximately 1-2%) between penicillins and cephalosporins. The nurse should verify the nature and severity of the penicillin allergy. If the reaction was anaphylaxis, cephalosporins may be contraindicated. A mild penicillin allergy may allow cautious cephalosporin use. Refusing entirely or ignoring the allergy are both inappropriate. Nurses cannot substitute medications without an order.",
    s: "Pharmacology"
  },
  {
    q: "A client on prolonged broad-spectrum antibiotic therapy develops watery diarrhea, abdominal cramping, and a fever of 38.5 degrees Celsius. The nurse suspects:",
    o: ["Clostridioides difficile infection", "Medication non-adherence", "Lactose intolerance", "Viral gastroenteritis unrelated to the antibiotic"],
    a: 0,
    r: "Prolonged antibiotic use disrupts normal intestinal flora, creating an environment favorable for Clostridioides difficile overgrowth. Watery diarrhea, cramping, and fever are classic signs. Contact precautions should be initiated and a stool sample sent for C. difficile toxin testing. This is a known complication of broad-spectrum antibiotics, not non-adherence, lactose intolerance, or unrelated viral illness.",
    s: "Pharmacology"
  },
  {
    q: "A nurse is teaching a client prescribed metronidazole (Flagyl) for a Clostridioides difficile infection. Which instruction is essential?",
    o: ["Avoid all alcohol during treatment and for at least 72 hours after the last dose", "Take the medication on an empty stomach for best absorption", "Expect your urine to turn bright blue during treatment", "Discontinue the medication as soon as diarrhea resolves"],
    a: 0,
    r: "Metronidazole causes a disulfiram-like reaction when combined with alcohol, leading to severe nausea, vomiting, flushing, and abdominal cramps. Alcohol must be avoided during and for at least 72 hours after treatment. The medication can be taken with food. Urine may darken but does not turn blue. The full course must be completed regardless of symptom resolution.",
    s: "Pharmacology"
  },
  {
    q: "A client is receiving IV amphotericin B for a systemic fungal infection. The nurse should monitor for which potentially life-threatening adverse effect?",
    o: ["Nephrotoxicity with rising serum creatinine", "Hepatic encephalopathy", "Ototoxicity with bilateral hearing loss", "Pulmonary embolism"],
    a: 0,
    r: "Amphotericin B is highly nephrotoxic, earning the nickname 'amphoterrible.' Rising BUN and creatinine levels indicate renal damage. IV hydration before infusion helps reduce nephrotoxicity. While infusion-related reactions (fever, chills, rigors) are common, renal damage is the most serious long-term concern. Hepatic encephalopathy, ototoxicity, and PE are not primary adverse effects.",
    s: "Pharmacology"
  },
  // ===== ANALGESICS (Questions 32-39) =====
  {
    q: "A nurse is assessing a client who has been receiving morphine via patient-controlled analgesia (PCA) for postoperative pain. The client is difficult to arouse, with a respiratory rate of 6 breaths per minute and pinpoint pupils. The priority action is to:",
    o: ["Administer naloxone (Narcan) as prescribed and support airway", "Increase the PCA demand dose for better pain control", "Turn off the PCA pump and let the client sleep", "Administer oxygen via nasal cannula at 2 liters per minute"],
    a: 0,
    r: "Respiratory depression (RR below 8), sedation, and miosis (pinpoint pupils) are signs of opioid overdose. Naloxone is the opioid antagonist that reverses respiratory depression and must be administered immediately while supporting the airway. Increasing the dose would be fatal. Letting the client sleep ignores respiratory compromise. Oxygen alone is insufficient without reversing the overdose.",
    s: "Pharmacology"
  },
  {
    q: "A client with chronic pain is prescribed acetaminophen 1000 mg every 6 hours. The nurse should educate the client that the maximum daily dose should not exceed:",
    o: ["4000 mg per day, and lower if consuming alcohol or with liver disease", "8000 mg per day", "2000 mg per day", "There is no maximum daily dose for acetaminophen"],
    a: 0,
    r: "The maximum daily dose of acetaminophen is 4000 mg (4 grams) for adults, though lower limits (2000-3000 mg) are recommended for clients with hepatic impairment, chronic alcohol use, or older adults. Exceeding 4000 mg increases the risk of hepatotoxicity and liver failure. Acetaminophen has a clear maximum dose, and clients must be taught to check all OTC products for hidden acetaminophen content.",
    s: "Pharmacology"
  },
  {
    q: "A nurse is caring for a client receiving a fentanyl transdermal patch for chronic cancer pain. The client develops a fever of 39.2 degrees Celsius. The nurse should be most concerned about:",
    o: ["Increased absorption of fentanyl leading to potential overdose", "Decreased effectiveness of the patch due to diaphoresis", "The patch adhesive causing a skin infection", "The need to switch to oral opioids during fever"],
    a: 0,
    r: "Fever increases skin temperature and blood flow, which accelerates fentanyl absorption from the transdermal patch, potentially causing opioid toxicity and respiratory depression. External heat sources such as heating pads, hot tubs, and fevers can increase delivery by 25-50%. The nurse must monitor closely for signs of overdose and notify the provider.",
    s: "Pharmacology"
  },
  {
    q: "A client is prescribed celecoxib (Celebrex) for osteoarthritis. The nurse should assess the client for a history of:",
    o: ["Cardiovascular disease and sulfonamide allergy", "Penicillin allergy and diabetes", "Hepatitis C and hypothyroidism", "Asthma and iron deficiency anemia"],
    a: 0,
    r: "Celecoxib is a COX-2 selective NSAID that carries a Black Box Warning for increased cardiovascular thrombotic events (MI, stroke). It also contains a sulfonamide moiety and is contraindicated in clients with sulfa allergies. Penicillin allergy is not relevant. While liver function should be monitored, hepatitis C screening is not a prerequisite. Asthma is a concern with non-selective NSAIDs.",
    s: "Pharmacology"
  },
  {
    q: "A nurse is managing a client with a naloxone (Narcan) drip after reversing an opioid overdose. The client becomes agitated and reports severe pain. The appropriate nursing response is to:",
    o: ["Titrate the naloxone to maintain adequate respirations while minimizing withdrawal symptoms", "Administer a large dose of morphine for pain control", "Discontinue the naloxone immediately", "Restrain the client and continue the naloxone at the current rate"],
    a: 0,
    r: "Naloxone reverses all opioid effects including analgesia, which can precipitate acute withdrawal and severe pain. The goal is to titrate the naloxone to reverse respiratory depression while minimizing withdrawal symptoms. Administering a large opioid dose would re-sedate the client. Stopping naloxone could cause re-narcotization as many opioids have longer half-lives than naloxone. Restraint is not appropriate.",
    s: "Pharmacology"
  },
  {
    q: "A client taking ibuprofen 800 mg three times daily for rheumatoid arthritis reports dark tarry stools. The nurse's priority action is to:",
    o: ["Hold the medication and notify the healthcare provider immediately", "Continue the medication and increase fiber intake", "Switch to a higher dose of ibuprofen", "Recommend taking the medication with milk"],
    a: 0,
    r: "Dark tarry stools (melena) indicate upper gastrointestinal bleeding, a serious complication of NSAID use. NSAIDs inhibit prostaglandin production, reducing the protective gastric mucosal barrier. The medication must be held and the provider notified for evaluation. Continuing the medication or increasing the dose could worsen the bleeding. Milk does not prevent GI hemorrhage.",
    s: "Pharmacology"
  },
  {
    q: "A nurse is caring for a client in the emergency department who has taken 30 acetaminophen tablets approximately 2 hours ago. Which medication should be administered as the antidote?",
    o: ["N-acetylcysteine (Mucomyst)", "Naloxone (Narcan)", "Flumazenil (Romazicon)", "Activated charcoal only"],
    a: 0,
    r: "N-acetylcysteine (NAC) is the specific antidote for acetaminophen overdose. It replenishes glutathione stores, which are depleted by the toxic metabolite NAPQI, and is most effective when given within 8 hours of ingestion. Naloxone reverses opioids. Flumazenil reverses benzodiazepines. Activated charcoal may be given early but is not the definitive antidote.",
    s: "Pharmacology"
  },
  {
    q: "A client receiving hydromorphone (Dilaudid) via IV has a pain rating of 3 out of 10 but reports severe nausea and constipation. The nurse should first:",
    o: ["Assess for prescribed antiemetic and bowel regimen orders", "Discontinue the hydromorphone without a provider order", "Administer an additional dose for breakthrough pain", "Advise the client that these effects will resolve on their own"],
    a: 0,
    r: "Nausea and constipation are common opioid side effects. Constipation does not develop tolerance and requires a bowel regimen (stool softener, stimulant laxative) throughout therapy. The nurse should assess for existing orders for antiemetics and bowel management. Discontinuing without an order is outside scope. Additional opioids are unnecessary with a pain level of 3. Constipation will not resolve spontaneously with continued opioid use.",
    s: "Pharmacology"
  },
  // ===== ENDOCRINE DRUGS (Questions 40-48) =====
  {
    q: "A client with type 1 diabetes is prescribed insulin glargine (Lantus). The nurse should teach the client that this insulin:",
    o: ["Provides a steady basal level of insulin over 24 hours and should not be mixed with other insulins", "Has an onset of 15 minutes and should be given before meals", "Should be drawn up in the same syringe as regular insulin", "Peaks within 2 hours and covers mealtime glucose spikes"],
    a: 0,
    r: "Insulin glargine is a long-acting basal insulin with an onset of 1-2 hours, no pronounced peak, and a duration of approximately 24 hours. It must not be mixed with other insulins due to its acidic pH, which would alter the pharmacokinetics of other insulins. Rapid-acting insulins like lispro have a 15-minute onset. Glargine does not cover mealtime spikes; rapid-acting insulins serve that purpose.",
    s: "Pharmacology"
  },
  {
    q: "A nurse is monitoring a client with type 2 diabetes who takes metformin (Glucophage). The client is scheduled for a CT scan with IV contrast dye. The nurse should plan to:",
    o: ["Hold metformin before the procedure and for at least 48 hours after contrast administration", "Increase the metformin dose on the day of the scan", "Administer metformin with the contrast dye for glucose control", "Switch to insulin permanently before the procedure"],
    a: 0,
    r: "Metformin must be held before and for 48 hours after IV contrast dye administration due to the risk of contrast-induced nephropathy. If renal function declines, metformin can accumulate and cause life-threatening lactic acidosis. Renal function should be verified before restarting. Increasing the dose or administering with contrast is dangerous. A permanent switch to insulin is not indicated.",
    s: "Pharmacology"
  },
  {
    q: "A client taking levothyroxine (Synthroid) for hypothyroidism asks the nurse about the best time to take the medication. The nurse's best response is:",
    o: ["Take it on an empty stomach, 30 to 60 minutes before breakfast", "Take it with a calcium supplement and a glass of milk", "Take it at bedtime with a large meal for best absorption", "Take it any time of day with or without food"],
    a: 0,
    r: "Levothyroxine should be taken on an empty stomach, 30-60 minutes before breakfast, to maximize absorption. Calcium, iron, antacids, and high-fiber foods interfere with absorption. Taking with a calcium supplement or milk would reduce effectiveness. Consistency in timing is important for stable thyroid hormone levels.",
    s: "Pharmacology"
  },
  {
    q: "A client with Graves disease is receiving propylthiouracil (PTU). The nurse should monitor for which serious adverse effect?",
    o: ["Agranulocytosis indicated by sore throat, fever, and mouth ulcers", "Hyperglycemia and polyuria", "Weight gain and constipation", "Bilateral hearing loss"],
    a: 0,
    r: "PTU can cause agranulocytosis, a life-threatening reduction in white blood cells that increases infection risk. Early signs include sore throat, fever, and oral ulcers. A complete blood count should be obtained if these symptoms occur. Hyperglycemia is not caused by PTU. Weight gain and constipation are symptoms of hypothyroidism, a therapeutic effect but not a dangerous side effect. PTU does not cause hearing loss.",
    s: "Pharmacology"
  },
  {
    q: "A nurse is teaching a client about the proper use of a GLP-1 receptor agonist (semaglutide) for type 2 diabetes. Which statement by the client indicates a need for further teaching?",
    o: ["I will take this medication right before each meal to cover my carbs", "I will inject this medication once weekly as prescribed", "I should report persistent nausea or abdominal pain to my provider", "I understand this medication may help with weight management"],
    a: 0,
    r: "Semaglutide (Ozempic) is a once-weekly subcutaneous injection, not a mealtime medication. It works by enhancing glucose-dependent insulin secretion, suppressing glucagon, and slowing gastric emptying. Stating it should be taken before each meal indicates confusion with mealtime insulin. Weekly dosing, reporting GI symptoms, and understanding weight effects are correct.",
    s: "Pharmacology"
  },
  {
    q: "A client with diabetic ketoacidosis (DKA) is receiving an IV insulin drip. The nurse notes the blood glucose has dropped to 13.9 mmol/L. Which action does the nurse anticipate?",
    o: ["Begin a dextrose-containing IV solution while continuing the insulin drip", "Discontinue the insulin drip immediately", "Administer a bolus of 50% dextrose", "Switch to subcutaneous insulin glargine immediately"],
    a: 0,
    r: "When blood glucose in DKA reaches approximately 13.9 mmol/L (250 mg/dL), a dextrose-containing IV solution (D5W or D5 0.45% NS) is added to prevent hypoglycemia while the insulin drip continues to correct the anion gap acidosis. Stopping the drip prematurely could cause rebound ketoacidosis. A dextrose bolus is used for severe hypoglycemia. Transitioning to subcutaneous insulin occurs only after the anion gap closes.",
    s: "Pharmacology"
  },
  {
    q: "A client taking glyburide (a sulfonylurea) for type 2 diabetes presents with confusion, diaphoresis, and tremors at 1500 hours. The nurse's priority action is to:",
    o: ["Check blood glucose and administer a fast-acting carbohydrate if hypoglycemic", "Administer the next scheduled dose of glyburide", "Withhold food and reassess in one hour", "Administer insulin to correct a potential hyperglycemic episode"],
    a: 0,
    r: "Confusion, diaphoresis, and tremors are classic signs of hypoglycemia. Sulfonylureas stimulate insulin release from pancreatic beta cells and can cause hypoglycemia, especially if meals are skipped. Blood glucose must be checked immediately and a fast-acting carbohydrate given if low. Administering more glyburide or insulin would worsen hypoglycemia. Withholding food is dangerous.",
    s: "Pharmacology"
  },
  {
    q: "A nurse is caring for a client receiving IV dexamethasone for cerebral edema. Which lab value should the nurse monitor most closely?",
    o: ["Blood glucose", "Serum calcium", "Hemoglobin", "Serum albumin"],
    a: 0,
    r: "Corticosteroids like dexamethasone stimulate gluconeogenesis and impair insulin sensitivity, leading to hyperglycemia even in non-diabetic clients. Blood glucose should be monitored frequently. While corticosteroids can affect calcium and other electrolytes, hyperglycemia is the most clinically significant and common laboratory abnormality requiring close monitoring.",
    s: "Pharmacology"
  },
  {
    q: "A client with Addison disease is prescribed hydrocortisone replacement therapy. The nurse should teach the client to:",
    o: ["Increase the dose during periods of illness or physiological stress", "Take the medication only when symptoms occur", "Discontinue the medication abruptly if side effects develop", "Avoid taking the medication with food"],
    a: 0,
    r: "Clients with Addison disease require lifelong glucocorticoid replacement. During illness, surgery, or physiological stress, cortisol demand increases and the dose must be adjusted (stress dosing) to prevent adrenal crisis. The medication must never be discontinued abruptly as this can cause life-threatening adrenal crisis. It should be taken consistently, not only when symptomatic.",
    s: "Pharmacology"
  },
  // ===== RESPIRATORY DRUGS (Questions 49-55) =====
  {
    q: "A nurse is teaching a client about the proper use of a metered-dose inhaler with albuterol and beclomethasone. Which instruction is correct?",
    o: ["Use the albuterol inhaler first, wait 1 to 2 minutes, then use the beclomethasone inhaler", "Use the beclomethasone inhaler first, then the albuterol", "Mix both medications in a nebulizer for simultaneous administration", "Use either inhaler first since the order does not matter"],
    a: 0,
    r: "Albuterol (a bronchodilator) should be administered first to open the airways, followed by beclomethasone (an inhaled corticosteroid) 1-2 minutes later for deeper penetration into the bronchial tree. Using the corticosteroid first limits its deposition due to bronchoconstriction. These medications should not be mixed. The order is clinically significant for optimal drug delivery.",
    s: "Pharmacology"
  },
  {
    q: "A nurse is caring for a client using a fluticasone (Flovent) inhaler for persistent asthma. Which instruction is essential to prevent a common adverse effect?",
    o: ["Rinse your mouth with water and spit after each use to prevent oral candidiasis", "Swallow the residual medication after inhaling for maximum effect", "Use the inhaler only during acute asthma attacks", "Store the inhaler in the refrigerator between uses"],
    a: 0,
    r: "Inhaled corticosteroids like fluticasone deposit in the oropharynx, promoting Candida overgrowth (oral thrush). Rinsing and spitting after each use removes residual medication and significantly reduces this risk. Swallowing residual medication increases systemic absorption. Fluticasone is a maintenance medication, not a rescue inhaler. Refrigeration is not required.",
    s: "Pharmacology"
  },
  {
    q: "A client with COPD is prescribed tiotropium (Spiriva). The nurse explains that this medication works by:",
    o: ["Blocking acetylcholine receptors in the airways to produce long-acting bronchodilation", "Reducing airway inflammation by suppressing the immune response", "Breaking down thick mucus to facilitate expectoration", "Inhibiting leukotriene receptors to prevent bronchoconstriction"],
    a: 0,
    r: "Tiotropium is a long-acting anticholinergic (muscarinic antagonist) bronchodilator. It blocks acetylcholine at muscarinic receptors in airway smooth muscle, producing sustained bronchodilation for 24 hours. It does not reduce inflammation (corticosteroids do that), break down mucus (mucolytics do that), or block leukotrienes (montelukast does that).",
    s: "Pharmacology"
  },
  {
    q: "A client is receiving IV aminophylline (theophylline) for severe COPD exacerbation. The nurse notes a serum theophylline level of 25 mcg/mL (therapeutic range 10-20 mcg/mL). The nurse should anticipate:",
    o: ["Holding the infusion and monitoring for toxicity signs such as tachycardia and seizures", "Increasing the infusion rate to achieve better bronchodilation", "Continuing the infusion at the current rate", "Administering a loading dose of theophylline"],
    a: 0,
    r: "A theophylline level of 25 mcg/mL exceeds the therapeutic range (10-20 mcg/mL) and indicates toxicity. Signs include tachycardia, nausea, vomiting, restlessness, and seizures at higher levels. The infusion should be held immediately and the provider notified. Increasing the rate or giving a loading dose would worsen toxicity. The narrow therapeutic index of theophylline makes monitoring essential.",
    s: "Pharmacology"
  },
  {
    q: "A nurse is administering montelukast (Singulair) to a pediatric client with asthma. The parent asks when the medication should be given. The nurse responds:",
    o: ["Give it once daily in the evening for ongoing asthma prevention", "Give it only during an acute asthma attack for immediate relief", "Give it three times daily with meals", "Give it as needed when the child starts wheezing"],
    a: 0,
    r: "Montelukast is a leukotriene receptor antagonist used for maintenance therapy in asthma. It is taken once daily in the evening. It is not a rescue medication and does not provide immediate relief during acute attacks. It prevents bronchoconstriction and inflammation by blocking leukotrienes. Three-times-daily dosing is incorrect.",
    s: "Pharmacology"
  },
  {
    q: "A client with pneumonia is prescribed IV azithromycin. The nurse should assess for which cardiac side effect?",
    o: ["QT prolongation and risk of torsades de pointes", "Atrial fibrillation", "Pericarditis", "Complete heart block"],
    a: 0,
    r: "Macrolide antibiotics including azithromycin carry a risk of QT interval prolongation, which can lead to the life-threatening ventricular arrhythmia torsades de pointes. This risk is increased in clients with existing QT prolongation, electrolyte imbalances, or concurrent use of other QT-prolonging drugs. Atrial fibrillation, pericarditis, and complete heart block are not primary cardiac risks of azithromycin.",
    s: "Pharmacology"
  },
  {
    q: "A nurse is teaching a client about the use of ipratropium bromide (Atrovent) inhaler. Which statement by the client indicates understanding?",
    o: ["I should avoid getting this medication in my eyes because it can cause blurred vision", "I should use this medication as my only rescue inhaler during asthma attacks", "I can expect immediate relief within seconds of using this inhaler", "I should use this medication only at bedtime"],
    a: 0,
    r: "Ipratropium is an anticholinergic bronchodilator. If the mist contacts the eyes, it can cause mydriasis and blurred vision, especially problematic for clients with narrow-angle glaucoma. It is not a first-line rescue inhaler (albuterol is preferred). Its onset is 15-30 minutes, not seconds. It can be used multiple times daily, not just at bedtime.",
    s: "Pharmacology"
  },
  // ===== PSYCHIATRIC MEDICATIONS (Questions 56-63) =====
  {
    q: "A client started on sertraline (Zoloft) two weeks ago for major depressive disorder reports feeling more energized but still has suicidal thoughts. The nurse's priority is to:",
    o: ["Initiate suicide precautions and notify the healthcare provider immediately", "Reassure the client that suicidal thoughts will resolve as the medication reaches full effect", "Discontinue the medication immediately", "Increase the dose to achieve a faster therapeutic response"],
    a: 0,
    r: "During the first 2-4 weeks of SSRI therapy, energy and motivation may improve before mood lifts, potentially increasing suicide risk. The client now has the energy to act on persistent suicidal ideation. Immediate safety measures and provider notification are essential. Reassurance alone is inadequate. Discontinuation or dose changes require provider evaluation.",
    s: "Pharmacology"
  },
  {
    q: "A nurse is caring for a client who takes phenelzine (Nardil), a monoamine oxidase inhibitor (MAOI). The client orders aged cheddar cheese and red wine with dinner. The nurse should:",
    o: ["Educate the client to avoid these foods due to the risk of hypertensive crisis", "Allow the meal since dietary restrictions do not apply to MAOIs", "Suggest switching from red wine to white wine only", "Recommend eating the cheese but avoiding the wine"],
    a: 0,
    r: "MAOIs like phenelzine interact with tyramine-rich foods (aged cheese, red wine, cured meats, soy sauce) causing a potentially fatal hypertensive crisis. Tyramine is normally metabolized by MAO in the gut, but with MAOI therapy, tyramine accumulates and triggers massive norepinephrine release. Both foods must be avoided. White wine also contains some tyramine.",
    s: "Pharmacology"
  },
  {
    q: "A client on lithium therapy for bipolar disorder presents with coarse tremors, persistent vomiting, and confusion. The serum lithium level is 2.1 mEq/L. The nurse should anticipate:",
    o: ["Holding lithium, IV fluid resuscitation, and possible hemodialysis", "Administering an additional dose to achieve the therapeutic range", "Continuing the current dose and rechecking the level in 1 week", "Administering an antiemetic and monitoring outpatient"],
    a: 0,
    r: "A lithium level of 2.1 mEq/L (therapeutic range 0.6-1.2 mEq/L for maintenance) indicates moderate-to-severe toxicity. Symptoms include coarse tremors, vomiting, confusion, and potentially seizures and coma. Treatment includes holding lithium, aggressive IV hydration to enhance renal clearance, and hemodialysis for severe cases. The medication must not be continued. Outpatient monitoring is inadequate for this level of toxicity.",
    s: "Pharmacology"
  },
  {
    q: "A nurse is monitoring a client who started olanzapine (Zyprexa) for schizophrenia. Which metabolic parameter should be assessed regularly?",
    o: ["Fasting blood glucose and lipid panel", "Serum iron and ferritin", "Thyroid function tests", "Serum B12 and folate levels"],
    a: 0,
    r: "Atypical antipsychotics, particularly olanzapine and clozapine, carry a significant risk of metabolic syndrome including weight gain, hyperglycemia, dyslipidemia, and type 2 diabetes. Regular monitoring of fasting glucose, HbA1C, and lipid panels is recommended. Iron studies, thyroid function, and B12/folate are not specifically indicated for olanzapine monitoring.",
    s: "Pharmacology"
  },
  {
    q: "A client taking clozapine (Clozaril) for treatment-resistant schizophrenia has a white blood cell count of 2,800 cells/mm3. The nurse's priority action is to:",
    o: ["Hold the medication and notify the provider as this may indicate agranulocytosis", "Continue the medication since the WBC is within normal range", "Administer a dose of filgrastim without a provider order", "Recheck the WBC in one month"],
    a: 0,
    r: "Clozapine carries a Black Box Warning for agranulocytosis. A WBC below 3,000 or ANC below 1,500 requires immediate drug discontinuation and hematologic evaluation. Regular blood monitoring through the Clozapine REMS program is mandatory. Normal WBC is 4,500-11,000. This level is below normal and potentially dangerous. Waiting one month could be fatal.",
    s: "Pharmacology"
  },
  {
    q: "A nurse is providing teaching to a client prescribed lamotrigine (Lamictal) for bipolar disorder. Which adverse effect requires immediate medical attention?",
    o: ["Development of a skin rash, especially with mucosal involvement", "Mild drowsiness during the first week of therapy", "Slight weight gain of 1 kg over the first month", "Occasional headaches in the morning"],
    a: 0,
    r: "Lamotrigine carries a Black Box Warning for Stevens-Johnson syndrome (SJS) and toxic epidermal necrolysis (TEN), potentially fatal dermatologic reactions. Any rash, especially with mucosal involvement (mouth, eyes, genitals), fever, or blistering, requires immediate discontinuation and medical evaluation. The risk is higher with rapid dose titration. Drowsiness, mild weight gain, and headaches are minor side effects.",
    s: "Pharmacology"
  },
  {
    q: "A client taking fluoxetine (Prozac) is also prescribed tramadol for pain management. The nurse should be most concerned about the risk of:",
    o: ["Serotonin syndrome", "Neuroleptic malignant syndrome", "Respiratory depression", "QT prolongation"],
    a: 0,
    r: "Combining fluoxetine (an SSRI) with tramadol (which also has serotonergic activity) significantly increases the risk of serotonin syndrome, characterized by agitation, hyperthermia, hyperreflexia, clonus, diaphoresis, and potentially death. Neuroleptic malignant syndrome is associated with antipsychotics. While tramadol can cause respiratory depression, the primary concern with this combination is serotonergic toxicity.",
    s: "Pharmacology"
  },
  {
    q: "A nurse is caring for a client who has been taking alprazolam (Xanax) daily for 6 months and wants to discontinue the medication. The nurse should advise the client to:",
    o: ["Gradually taper the dose under medical supervision to prevent withdrawal seizures", "Stop the medication immediately since benzodiazepines are not physically addictive", "Switch to a higher dose for one week then stop completely", "Continue the medication indefinitely as it cannot be safely discontinued"],
    a: 0,
    r: "Benzodiazepines cause physical dependence with chronic use. Abrupt discontinuation can cause life-threatening withdrawal symptoms including seizures, delirium, and autonomic instability. A gradual taper over weeks to months under medical supervision is required. Benzodiazepines are physically addictive. Increasing the dose before stopping is dangerous. The medication can be safely discontinued with proper tapering.",
    s: "Pharmacology"
  },
  // ===== ONCOLOGY DRUGS (Questions 64-69) =====
  {
    q: "A nurse is caring for a client receiving IV cyclophosphamide for cancer treatment. Which intervention is essential to prevent a serious urinary complication?",
    o: ["Ensure aggressive IV hydration and administer mesna as prescribed", "Restrict fluid intake to 500 mL per day", "Insert a urinary catheter for continuous bladder irrigation", "Administer sodium bicarbonate to alkalinize the urine"],
    a: 0,
    r: "Cyclophosphamide produces the toxic metabolite acrolein, which causes hemorrhagic cystitis. Aggressive IV hydration dilutes acrolein in the urine, and mesna (a uroprotectant) binds to acrolein to neutralize it. Fluid restriction would concentrate the toxic metabolite. Continuous bladder irrigation is not standard prophylaxis. Urine alkalinization is used for other agents like methotrexate.",
    s: "Pharmacology"
  },
  {
    q: "A client is receiving doxorubicin (Adriamycin) for breast cancer. The nurse should be most concerned about which cumulative dose-related toxicity?",
    o: ["Cardiotoxicity leading to cardiomyopathy and heart failure", "Hepatotoxicity leading to cirrhosis", "Pulmonary toxicity leading to fibrosis", "Nephrotoxicity leading to renal failure"],
    a: 0,
    r: "Doxorubicin has a dose-limiting cumulative cardiotoxicity that can cause irreversible cardiomyopathy and heart failure. Lifetime cumulative doses are typically limited to 450-550 mg/m2. Serial echocardiograms or MUGA scans monitor ejection fraction. Dexrazoxane may be used as a cardioprotectant. Hepatotoxicity, pulmonary fibrosis, and nephrotoxicity are not the primary dose-limiting toxicities of doxorubicin.",
    s: "Pharmacology"
  },
  {
    q: "A nurse is preparing to administer IV vincristine. During administration, the client reports burning pain at the IV site. The nurse notes swelling around the insertion point. The priority action is to:",
    o: ["Stop the infusion immediately as this indicates extravasation", "Slow the infusion rate and apply a warm compress", "Flush the IV line with normal saline and continue the infusion", "Elevate the extremity and continue the infusion at a slower rate"],
    a: 0,
    r: "Vincristine is a vesicant chemotherapy agent that causes severe tissue necrosis if it extravasates. Burning pain and swelling at the IV site are classic signs of extravasation. The infusion must be stopped immediately. Aspirate any residual drug, and follow institutional extravasation protocols. Continuing the infusion in any form would cause further tissue damage.",
    s: "Pharmacology"
  },
  {
    q: "A client receiving cisplatin for testicular cancer has a serum magnesium level of 0.5 mmol/L. The nurse recognizes this finding is most likely related to:",
    o: ["Cisplatin-induced renal magnesium wasting", "Excessive oral magnesium supplementation", "The client's dietary intake", "A laboratory error"],
    a: 0,
    r: "Cisplatin is highly nephrotoxic and causes renal tubular damage leading to significant magnesium wasting. Hypomagnesemia (normal 0.75-1.0 mmol/L) is a common and sometimes severe complication requiring IV magnesium replacement and close monitoring of renal function and electrolytes. Excess supplementation would cause hypermagnesemia. Diet alone rarely causes this level of depletion.",
    s: "Pharmacology"
  },
  {
    q: "A nurse is caring for a client on high-dose methotrexate therapy for osteosarcoma. Which medication must be administered as a rescue agent?",
    o: ["Leucovorin (folinic acid)", "Folic acid", "Vitamin B12", "Iron dextran"],
    a: 0,
    r: "Leucovorin rescue is essential after high-dose methotrexate to protect normal cells from the cytotoxic effects of folate antagonism. Leucovorin bypasses the metabolic block caused by methotrexate, providing reduced folate directly to normal cells. Regular folic acid cannot bypass the block. Vitamin B12 and iron dextran do not counteract methotrexate toxicity.",
    s: "Pharmacology"
  },
  {
    q: "A client receiving chemotherapy has an absolute neutrophil count (ANC) of 400 cells/mm3. The nurse should implement which precaution?",
    o: ["Neutropenic precautions including strict hand hygiene, no fresh flowers, and no raw fruits or vegetables", "Standard precautions only", "Contact precautions with gown and gloves", "Airborne precautions with an N95 respirator"],
    a: 0,
    r: "An ANC below 500 indicates severe neutropenia with high infection risk. Neutropenic precautions include meticulous hand hygiene, private room, avoiding fresh flowers (fungal spores), raw foods, and limiting visitors with infections. Standard precautions alone are insufficient. Contact and airborne precautions are for specific pathogen transmission, not immune suppression.",
    s: "Pharmacology"
  },
  // ===== GI DRUGS (Questions 70-76) =====
  {
    q: "A client is prescribed omeprazole (Prilosec) for gastroesophageal reflux disease. The nurse should instruct the client to take this medication:",
    o: ["30 to 60 minutes before the first meal of the day", "Immediately after meals with a full glass of water", "At bedtime on an empty stomach", "Only when experiencing heartburn symptoms"],
    a: 0,
    r: "Proton pump inhibitors like omeprazole should be taken 30-60 minutes before the first meal for optimal acid suppression. PPIs inhibit the hydrogen-potassium ATPase pump, which is most active during meal-stimulated acid secretion. Taking after meals reduces effectiveness. PPIs are maintenance medications, not taken only as needed for symptoms.",
    s: "Pharmacology"
  },
  {
    q: "A nurse is monitoring a client who has been taking a proton pump inhibitor (PPI) for several years. Which long-term complication should the nurse monitor for?",
    o: ["Increased risk of Clostridioides difficile infection and bone fractures", "Hepatic cirrhosis", "Hyperthyroidism", "Aplastic anemia"],
    a: 0,
    r: "Long-term PPI use is associated with increased risk of C. difficile infection (reduced gastric acid allows bacterial colonization), osteoporosis-related fractures (impaired calcium absorption), hypomagnesemia, vitamin B12 deficiency, and community-acquired pneumonia. Hepatic cirrhosis, hyperthyroidism, and aplastic anemia are not established complications of PPI therapy.",
    s: "Pharmacology"
  },
  {
    q: "A client receiving lactulose for hepatic encephalopathy has had 5 liquid stools today. The client's ammonia level has decreased from the previous day. The nurse should:",
    o: ["Continue the medication as the therapeutic goal is 2-3 soft stools per day but reassess for dehydration", "Hold the medication since the ammonia level is improving", "Administer an antidiarrheal to control the stool output", "Increase the lactulose dose for faster ammonia clearance"],
    a: 0,
    r: "Lactulose works by trapping ammonia in the colon for fecal elimination. The therapeutic goal is 2-3 soft stools daily. Five stools may indicate overaggressive dosing, risking dehydration and electrolyte imbalances. The dose may need adjustment, but the medication should not be stopped while ammonia is still elevated. Antidiarrheals would negate lactulose's mechanism. Increasing the dose would worsen diarrhea.",
    s: "Pharmacology"
  },
  {
    q: "A client is prescribed ondansetron (Zofran) for chemotherapy-induced nausea and vomiting. The nurse should obtain which baseline assessment before administration?",
    o: ["A 12-lead ECG to assess QT interval", "A chest X-ray to rule out pneumonia", "A fasting blood glucose level", "A complete blood count with differential"],
    a: 0,
    r: "Ondansetron can prolong the QT interval, increasing the risk of torsades de pointes. A baseline ECG is recommended, especially in clients with cardiac history, electrolyte imbalances, or concurrent use of other QT-prolonging medications. A chest X-ray, fasting glucose, and CBC are not specifically required before ondansetron administration.",
    s: "Pharmacology"
  },
  {
    q: "A nurse is caring for a client taking sucralfate (Carafate) for a duodenal ulcer. The client is also prescribed ciprofloxacin. The nurse should plan to:",
    o: ["Administer the ciprofloxacin at least 2 hours before or 6 hours after sucralfate", "Administer both medications simultaneously for convenience", "Hold the sucralfate while the client is on ciprofloxacin", "Crush the sucralfate and mix with the ciprofloxacin"],
    a: 0,
    r: "Sucralfate forms a protective barrier in the GI tract and can bind to other medications, significantly reducing their absorption. Fluoroquinolones like ciprofloxacin must be given at least 2 hours before or 6 hours after sucralfate to ensure adequate absorption. Simultaneous administration would render the antibiotic ineffective. Holding sucralfate entirely is unnecessary with proper timing.",
    s: "Pharmacology"
  },
  {
    q: "A client taking misoprostol (Cytotec) as a gastroprotective agent alongside chronic NSAID therapy asks the nurse about important precautions. The nurse should emphasize:",
    o: ["This medication is absolutely contraindicated in pregnancy due to risk of uterine contractions and abortion", "The medication can be safely used during pregnancy", "The medication only needs to be taken when GI symptoms occur", "The medication should be taken on an empty stomach"],
    a: 0,
    r: "Misoprostol is a synthetic prostaglandin E1 analog that protects the gastric mucosa but also stimulates uterine contractions. It is classified as Category X and absolutely contraindicated in pregnancy due to the risk of miscarriage, premature labor, and birth defects. Women of childbearing age must use reliable contraception. It is taken regularly with meals, not only when symptomatic.",
    s: "Pharmacology"
  },
  {
    q: "A nurse is preparing to administer IV pantoprazole (Protonix) to a client with acute upper GI bleeding. Which consideration is most important?",
    o: ["Administer as a slow IV infusion, not as a rapid IV push, to reduce phlebitis risk", "Mix the medication with enteral feedings for better absorption", "Administer intramuscularly if IV access is unavailable", "Give a double dose initially to achieve rapid acid suppression"],
    a: 0,
    r: "IV pantoprazole should be administered as a slow IV push over at least 2 minutes or as a 15-minute infusion to reduce the risk of phlebitis and adverse reactions. It is not mixed with enteral feedings. Pantoprazole is not given intramuscularly. Dosing follows established protocols; doubling without an order is outside nursing scope.",
    s: "Pharmacology"
  },
  // ===== ELECTROLYTE REPLACEMENTS (Questions 77-82) =====
  {
    q: "A client's serum potassium is 2.8 mEq/L. The provider orders IV potassium chloride 40 mEq in 1000 mL of normal saline. The nurse should ensure the infusion rate does not exceed:",
    o: ["10 mEq per hour for peripheral IV administration", "40 mEq per hour via peripheral IV push", "The entire dose given over 30 minutes", "100 mEq per hour for rapid correction"],
    a: 0,
    r: "IV potassium chloride must be infused slowly, typically not exceeding 10 mEq per hour via peripheral IV to prevent cardiac dysrhythmias and cardiac arrest. Potassium should never be given by IV push. Rapid infusion can cause fatal hyperkalemia. Higher rates (up to 20 mEq/hour) may be used via central line with continuous cardiac monitoring in critical situations.",
    s: "Pharmacology"
  },
  {
    q: "A nurse is administering IV calcium gluconate to a client with severe hypocalcemia. The nurse should monitor the client for which complication during infusion?",
    o: ["Bradycardia and cardiac arrest", "Hyperglycemia", "Bronchospasm", "Urinary retention"],
    a: 0,
    r: "IV calcium can cause bradycardia, hypotension, and cardiac arrest if administered too rapidly. Continuous cardiac monitoring is essential during infusion. Calcium directly affects cardiac conduction and contractility. Hyperglycemia, bronchospasm, and urinary retention are not primary concerns with calcium gluconate infusion.",
    s: "Pharmacology"
  },
  {
    q: "A client receiving IV magnesium sulfate for severe preeclampsia becomes lethargic, with a respiratory rate of 10 breaths per minute and absent deep tendon reflexes. The nurse should immediately:",
    o: ["Stop the magnesium infusion and administer calcium gluconate as the antidote", "Continue the infusion and monitor the client closely", "Increase the infusion rate to achieve a higher magnesium level", "Administer a dose of oxytocin to stimulate labor"],
    a: 0,
    r: "Absent deep tendon reflexes, respiratory depression, and lethargy are signs of magnesium toxicity. The infusion must be stopped immediately, and calcium gluconate (the specific antidote for magnesium toxicity) should be administered to counteract cardiac and respiratory effects. Continuing or increasing the infusion could cause respiratory arrest. Oxytocin is unrelated to this emergency.",
    s: "Pharmacology"
  },
  {
    q: "A nurse is preparing to administer sodium polystyrene sulfonate (Kayexalate) to a client with a potassium level of 6.2 mEq/L. The nurse understands this medication works by:",
    o: ["Exchanging sodium for potassium in the intestine, promoting fecal potassium excretion", "Promoting renal excretion of potassium through diuresis", "Shifting potassium intracellularly through insulin stimulation", "Directly binding potassium in the bloodstream for hepatic metabolism"],
    a: 0,
    r: "Sodium polystyrene sulfonate is a cation exchange resin that exchanges sodium ions for potassium ions in the intestinal lumen, promoting fecal elimination of potassium. It can be given orally or rectally. It does not work through the kidneys, does not shift potassium intracellularly (insulin and glucose do that), and does not bind potassium in the bloodstream.",
    s: "Pharmacology"
  },
  {
    q: "A client with hyponatremia has a serum sodium of 118 mEq/L. The provider orders hypertonic (3%) saline. The nurse should be most vigilant for:",
    o: ["Central pontine myelinolysis (osmotic demyelination syndrome) from overly rapid correction", "Hyperkalemia from sodium-potassium exchange", "Hypoglycemia from fluid shifts", "Fluid volume deficit from osmotic diuresis"],
    a: 0,
    r: "Rapid correction of severe hyponatremia with hypertonic saline can cause osmotic demyelination syndrome (central pontine myelinolysis), resulting in irreversible neurological damage. Sodium should be corrected no faster than 8-12 mEq/L in 24 hours. Hyperkalemia, hypoglycemia, and osmotic diuresis are not the primary risks of hypertonic saline administration.",
    s: "Pharmacology"
  },
  {
    q: "A nurse is administering IV phosphate replacement to a client with severe hypophosphatemia. Which electrolyte should be monitored concurrently?",
    o: ["Serum calcium level", "Serum sodium level", "Serum chloride level", "Serum glucose level"],
    a: 0,
    r: "Phosphate and calcium have an inverse relationship. As phosphate levels rise during replacement therapy, calcium levels can drop, potentially causing hypocalcemia with tetany, muscle spasms, and cardiac effects. Concurrent calcium monitoring is essential. Sodium, chloride, and glucose are not directly affected by phosphate replacement in a clinically significant way.",
    s: "Pharmacology"
  },
  // ===== IMMUNOSUPPRESSANTS (Questions 83-86) =====
  {
    q: "A nurse is caring for a post-kidney transplant client receiving tacrolimus (Prograf). The trough level is 18 ng/mL (therapeutic range 5-15 ng/mL). The nurse should:",
    o: ["Hold the dose and notify the provider as the level is supratherapeutic", "Administer the dose as this level indicates optimal immunosuppression", "Administer a double dose to prevent organ rejection", "Crush the medication and mix with grapefruit juice"],
    a: 0,
    r: "A tacrolimus trough of 18 ng/mL exceeds the therapeutic range and increases the risk of nephrotoxicity, neurotoxicity, and infection. The dose should be held and the provider notified for adjustment. Administering at this level could cause further toxicity. Doubling the dose would be dangerous. Grapefruit juice inhibits CYP3A4, increasing tacrolimus levels further.",
    s: "Pharmacology"
  },
  {
    q: "A client taking cyclosporine after a liver transplant reports gingival hyperplasia and hirsutism. The nurse should explain that these findings are:",
    o: ["Known side effects of cyclosporine that should be reported to the provider", "Signs of transplant rejection requiring emergent intervention", "Unrelated to the medication and likely due to a dental condition", "Expected signs that the medication is at the correct therapeutic level"],
    a: 0,
    r: "Gingival hyperplasia and hirsutism are well-documented side effects of cyclosporine. Good oral hygiene and regular dental care can help manage gingival changes. These are not signs of rejection. They are medication-related and should be reported so the provider can evaluate the need for dose adjustment or alternative immunosuppression. They do not confirm therapeutic levels.",
    s: "Pharmacology"
  },
  {
    q: "A client on mycophenolate mofetil (CellCept) for immunosuppression after heart transplant develops persistent diarrhea and a WBC of 2,500 cells/mm3. The nurse should:",
    o: ["Report findings immediately as they may indicate mycophenolate toxicity or infection", "Continue the medication and advise the client to increase fluid intake", "Administer loperamide without notifying the provider", "Reassure the client that diarrhea is a temporary and benign effect"],
    a: 0,
    r: "Mycophenolate commonly causes GI side effects including diarrhea. A low WBC (leukopenia) in an immunosuppressed client is concerning for bone marrow suppression or infection. Both findings should be reported promptly for dose evaluation and possible workup. Antidiarrheals should not be given without evaluation. Leukopenia in a transplant client is not benign.",
    s: "Pharmacology"
  },
  {
    q: "A nurse is educating a transplant recipient about the importance of avoiding live vaccines while on immunosuppressive therapy. Which vaccine should the client avoid?",
    o: ["MMR (measles, mumps, rubella)", "Inactivated influenza injection", "Hepatitis B", "Tetanus-diphtheria-pertussis (Tdap)"],
    a: 0,
    r: "MMR is a live attenuated vaccine and is contraindicated in immunosuppressed clients because the weakened virus could cause active infection in a host with inadequate immune response. Inactivated influenza (injection), hepatitis B, and Tdap are all inactivated or component vaccines that can be safely administered to immunocompromised clients.",
    s: "Pharmacology"
  },
  // ===== ANTI-DIABETICS (Questions 87-90) =====
  {
    q: "A client with type 2 diabetes is started on pioglitazone (Actos). The nurse should monitor for which serious adverse effect?",
    o: ["Signs of heart failure including weight gain, edema, and dyspnea", "Severe hypoglycemia requiring glucagon administration", "Lactic acidosis and elevated lactate levels", "Hypertensive crisis"],
    a: 0,
    r: "Thiazolidinediones like pioglitazone can cause fluid retention, leading to or exacerbating heart failure. They carry a Black Box Warning for HF. Signs include rapid weight gain, peripheral edema, and shortness of breath. Pioglitazone used alone rarely causes severe hypoglycemia. Lactic acidosis is associated with metformin. Hypertensive crisis is not a pioglitazone side effect.",
    s: "Pharmacology"
  },
  {
    q: "A nurse is teaching a client about the SGLT2 inhibitor empagliflozin (Jardiance) for type 2 diabetes. Which instruction is essential?",
    o: ["Report any signs of genital yeast infection or urinary tract infection immediately", "Monitor for signs of weight gain as a common side effect", "Avoid drinking water while taking this medication", "Take the medication only when blood glucose is above 11.1 mmol/L"],
    a: 0,
    r: "SGLT2 inhibitors work by preventing glucose reabsorption in the kidneys, causing glycosuria. This glucose-rich urine creates an environment for urinary tract infections and genital yeast infections, which are common side effects. SGLT2 inhibitors typically cause weight loss, not gain. Adequate hydration is important. The medication is taken daily regardless of glucose levels.",
    s: "Pharmacology"
  },
  {
    q: "A client receives insulin lispro (Humalog) at 0730 before breakfast. The nurse should monitor most closely for hypoglycemia at which time?",
    o: ["0800 to 0930, during the peak action time", "1400 to 1600, six hours after administration", "2200, at bedtime", "0200, during the overnight period"],
    a: 0,
    r: "Insulin lispro is a rapid-acting insulin with an onset of 15 minutes, peak action at 30 minutes to 2 hours, and duration of 3-5 hours. Given at 0730, peak action occurs approximately 0800-0930, which is the highest risk period for hypoglycemia. Monitoring at later times would be relevant for intermediate or long-acting insulins.",
    s: "Pharmacology"
  },
  {
    q: "A nurse is caring for a client with type 2 diabetes who takes acarbose (Precose). The client develops hypoglycemia. The nurse should treat this with:",
    o: ["Oral glucose tablets or gel", "A glass of orange juice", "A candy bar", "A glass of milk"],
    a: 0,
    r: "Acarbose is an alpha-glucosidase inhibitor that delays the breakdown of complex carbohydrates and disaccharides. In hypoglycemia, only pure glucose (glucose tablets or gel) will be effective because acarbose blocks the enzymatic breakdown of sucrose and other complex sugars. Orange juice (fructose and sucrose), candy (sucrose), and milk (lactose) would have delayed absorption due to the enzyme inhibition.",
    s: "Pharmacology"
  },
  // ===== ANTICONVULSANTS (Questions 91-95) =====
  {
    q: "A client is receiving IV phenytoin (Dilantin) for status epilepticus. The nurse should administer this medication:",
    o: ["Slowly via IV push, no faster than 50 mg per minute, with cardiac monitoring", "Rapidly via IV bolus over 10 seconds", "Mixed in a dextrose solution for IV infusion", "Via an IV line running lactated Ringer solution"],
    a: 0,
    r: "IV phenytoin must be administered slowly (no faster than 50 mg/min in adults) with continuous cardiac monitoring due to the risk of hypotension and cardiac dysrhythmias, including bradycardia and heart block. It must only be mixed with normal saline, as dextrose causes precipitation. Lactated Ringer solution is also incompatible. Rapid bolus administration can be fatal.",
    s: "Pharmacology"
  },
  {
    q: "A nurse is monitoring a client taking valproic acid (Depakote) for seizure disorder. Which laboratory value is most important to monitor regularly?",
    o: ["Liver function tests (AST, ALT)", "Serum creatinine and BUN", "Serum calcium levels", "Hemoglobin A1C"],
    a: 0,
    r: "Valproic acid carries a Black Box Warning for hepatotoxicity, which can be fatal, especially in children under 2 years. Regular monitoring of liver function tests (AST, ALT) is essential, particularly during the first 6 months of therapy. It can also cause pancreatitis and thrombocytopenia. Renal function, calcium, and A1C are not primary monitoring parameters for valproic acid.",
    s: "Pharmacology"
  },
  {
    q: "A client taking carbamazepine (Tegretol) for trigeminal neuralgia reports fever, sore throat, and unusual bruising. The nurse suspects:",
    o: ["Aplastic anemia or agranulocytosis", "A common cold unrelated to the medication", "An allergic reaction to a food", "Liver failure"],
    a: 0,
    r: "Carbamazepine carries a Black Box Warning for aplastic anemia and agranulocytosis. Fever, sore throat (indicating infection from neutropenia), and unusual bruising (indicating thrombocytopenia) are hallmark signs. A CBC should be obtained immediately. These symptoms are not consistent with a common cold or food allergy. While carbamazepine can affect the liver, these symptoms point to hematologic toxicity.",
    s: "Pharmacology"
  },
  {
    q: "A nurse is teaching a female client of childbearing age about starting topiramate (Topamax) for migraine prevention. Which counseling point is essential?",
    o: ["Use reliable contraception as topiramate is teratogenic and can reduce the effectiveness of oral contraceptives", "Topiramate is completely safe during pregnancy", "Oral contraceptives work better when combined with topiramate", "Pregnancy testing is not needed before starting topiramate"],
    a: 0,
    r: "Topiramate is associated with an increased risk of cleft lip and palate and is classified as teratogenic. Additionally, topiramate induces hepatic enzymes that can decrease the effectiveness of hormonal contraceptives. Women of childbearing age must use reliable non-hormonal contraception or additional barrier methods. Pregnancy testing should be performed before initiation.",
    s: "Pharmacology"
  },
  {
    q: "A nurse is preparing to administer IV levetiracetam (Keppra) to a client with seizures. Compared to phenytoin, what is an advantage of levetiracetam?",
    o: ["It can be diluted in dextrose or normal saline and has fewer drug interactions", "It requires cardiac monitoring during every infusion", "It causes more severe hepatotoxicity than phenytoin", "It must be administered intramuscularly only"],
    a: 0,
    r: "Levetiracetam has a significant advantage over phenytoin in that it is compatible with both dextrose and normal saline solutions, has minimal drug interactions, does not require therapeutic drug monitoring, and has a favorable side effect profile. Phenytoin requires cardiac monitoring and is only compatible with normal saline. Levetiracetam does not cause significant hepatotoxicity and is given IV, not IM only.",
    s: "Pharmacology"
  },
  // ===== DIURETICS (Questions 96-100) =====
  {
    q: "A client receiving furosemide (Lasix) 80 mg IV reports hearing loss and ringing in the ears during the infusion. The nurse should:",
    o: ["Slow the infusion rate and notify the provider as this indicates ototoxicity", "Continue the infusion at the current rate as this is expected", "Increase the rate to complete the infusion faster", "Administer an antihistamine for the ear symptoms"],
    a: 0,
    r: "Loop diuretics including furosemide can cause ototoxicity (tinnitus, hearing loss), especially with rapid IV administration or high doses. The infusion should be slowed (recommended rate no faster than 4 mg/min for furosemide) and the provider notified. Ototoxicity is not expected and should not be dismissed. Antihistamines do not treat drug-induced ototoxicity.",
    s: "Pharmacology"
  },
  {
    q: "A client is taking spironolactone (Aldactone) for heart failure. The nurse should instruct the client to avoid:",
    o: ["Salt substitutes containing potassium chloride", "Foods high in vitamin C", "Dairy products", "Caffeinated beverages"],
    a: 0,
    r: "Spironolactone is a potassium-sparing diuretic that blocks aldosterone, reducing potassium excretion. Salt substitutes typically contain potassium chloride and can cause dangerous hyperkalemia when combined with potassium-sparing diuretics. Foods high in vitamin C, dairy products, and caffeinated beverages do not pose specific risks with spironolactone.",
    s: "Pharmacology"
  },
  {
    q: "A client on hydrochlorothiazide (HCTZ) therapy for 3 months has a fasting glucose of 7.2 mmol/L. The nurse understands this is likely related to:",
    o: ["Thiazide-induced glucose intolerance and impaired insulin secretion", "The client developing unrelated type 1 diabetes", "A laboratory error that should be disregarded", "Improved renal function from the diuretic"],
    a: 0,
    r: "Thiazide diuretics can cause hyperglycemia through impaired insulin secretion and reduced insulin sensitivity, particularly with chronic use. A fasting glucose of 7.2 mmol/L (130 mg/dL) in a previously normoglycemic client should be reported and monitored. Thiazides can also cause hypokalemia, which further impairs insulin secretion. This is a known metabolic side effect, not a lab error.",
    s: "Pharmacology"
  },
  {
    q: "A nurse is caring for a client with increased intracranial pressure who is prescribed IV mannitol. Which assessment finding would require the nurse to hold the medication?",
    o: ["Serum osmolality of 320 mOsm/kg", "Blood pressure of 150/90 mmHg", "Heart rate of 78 bpm", "Urine output of 100 mL per hour"],
    a: 0,
    r: "Mannitol is an osmotic diuretic used to reduce intracranial pressure. It should be held when serum osmolality exceeds 310-320 mOsm/kg (normal 275-295) to prevent renal damage and severe dehydration. The blood pressure and heart rate are not contraindications. A urine output of 100 mL/hour indicates the medication is working as expected.",
    s: "Pharmacology"
  },
  {
    q: "A nurse is monitoring a client receiving IV acetazolamide (Diamox) for acute angle-closure glaucoma. The nurse should monitor for which electrolyte imbalance?",
    o: ["Metabolic acidosis due to bicarbonate wasting", "Metabolic alkalosis due to potassium retention", "Respiratory acidosis due to bronchospasm", "Respiratory alkalosis due to hyperventilation"],
    a: 0,
    r: "Acetazolamide is a carbonic anhydrase inhibitor that promotes renal excretion of bicarbonate, leading to metabolic acidosis (non-anion gap hyperchloremic metabolic acidosis). Clients should be monitored for signs of acidosis including fatigue, confusion, and Kussmaul respirations. It does not cause potassium retention or primary respiratory disturbances.",
    s: "Pharmacology"
  }
];
